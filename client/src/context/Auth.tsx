import React, { createContext, useMemo, useState } from "react";

interface IProps {
  isAuthenticated: boolean;
  login: (value: boolean) => void;
  logout: () => void;
  persist: any;
  setPersist: any;
}

export const AuthContext = createContext<IProps>({
  isAuthenticated: false,
  login() {},
  logout() {},
  persist: {},
  setPersist() {},
});

interface IChildren {
  children: React.ReactNode;
}

export function AuthContextProvider({ children }: IChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("userData")!)
  );
  const login = (value: boolean) => {
    setIsAuthenticated(value);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({ isAuthenticated, login, logout, setPersist, persist }),
    [isAuthenticated]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const AuthConsumer = AuthContext.Consumer;
