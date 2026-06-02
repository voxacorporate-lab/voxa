import { createContext, useContext, useState, ReactNode } from 'react';

interface NavbarContextValue {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  accountOpen: boolean;
  setAccountOpen: (v: boolean) => void;
}

const NavbarContext = createContext<NavbarContextValue>({
  mobileOpen: false,
  setMobileOpen: () => {},
  accountOpen: false,
  setAccountOpen: () => {},
});

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  return (
    <NavbarContext.Provider value={{ mobileOpen, setMobileOpen, accountOpen, setAccountOpen }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  return useContext(NavbarContext);
}
