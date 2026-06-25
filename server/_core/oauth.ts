import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { SignJWT } from "jose";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";

function getSessionSecret() {
    return new TextEncoder().encode(ENV.cookieSecret);
}

export async function createSessionToken(openId: string, name: string): Promise<string> {
    const issuedAt = Date.now();
    const expirationSeconds = Math.floor((issuedAt + ONE_YEAR_MS) / 1000);
    return new SignJWT({ openId, name })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(getSessionSecret());
}

export function registerOAuthRoutes(app: Express) {
    app.get("/api/auth/google", (_req: Request, res: Response) => {
          const params = new URLSearchParams({
                  client_id: ENV.googleClientId,
                  redirect_uri: ENV.googleCallbackUrl,
                  response_type: "code",
                  scope: "openid email profile",
                  access_type: "offline",
                  prompt: "select_account",
          });
          res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
    });

  app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
        const code = typeof req.query.code === "string" ? req.query.code : null;

              if (!code) {
                      res.status(400).json({ error: "Missing code from Google" });
                      return;
              }

              try {
                      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
                                method: "POST",
                                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                                body: new URLSearchParams({
                                            code,
                                            client_id: ENV.googleClientId,
                                            client_secret: ENV.googleClientSecret,
                                            redirect_uri: ENV.googleCallbackUrl,
                                            grant_type: "authorization_code",
                                }),
                      });

          const tokenData = await tokenRes.json() as any;

          if (!tokenData.access_token) {
                    console.error("[OAuth] Token exchange failed", tokenData);
                    res.status(400).json({ error: "Failed to get access token from Google" });
                    return;
          }

          const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${tokenData.access_token}` },
          });

          const userInfo = await userRes.json() as any;
                      const { sub: openId, email, name } = userInfo;

          if (!openId || !email) {
                    res.status(400).json({ error: "Could not get user info from Google" });
                    return;
          }

          const role = email === ENV.adminEmail ? "admin" : "user";

          await db.upsertUser({
                    openId,
                    name: name ?? null,
                    email,
                    loginMethod: "google",
                    role,
                    lastSignedIn: new Date(),
          });

          const sessionToken = await createSessionToken(openId, name ?? "");
                      const cookieOptions = getSessionCookieOptions(req);
                      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

          res.redirect(302, "/");
              } catch (error) {
                      console.error("[OAuth] Google callback failed", error);
                      res.status(500).json({ error: "OAuth callback failed" });
              }
  });
}
