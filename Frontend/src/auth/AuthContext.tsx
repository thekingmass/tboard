import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../api";
import { getUserInitials } from "../utils/initials";

type AuthContextValue = {
  isLoggedIn: boolean;
  login: (token: string, name?: string | null) => void;
  logout: () => void;
  name: string | null;
  initials: string;
  isAuthLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [name, setName] = useState<string | null>(
    localStorage.getItem("userName")
  );

  const login = (nextName?: string | null) => {

    setIsLoggedIn(true);

    if (typeof nextName === "string") {
      localStorage.setItem("userName", nextName);
      setName(nextName);
    }
  };

  const logout = () => {
   
    api.post("/api/logout").catch(() => {
    });

    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setName(null);
  };

  // On first load/refresh, ask the server if the cookie session is valid.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
  // backend returns 200 and user info when authenticated.
        const res = await api.get("/api/auth/me");

        //if component unmounts while the above request is in-flight then return and do not set anything- | cancelled is being true in the cleaner fuction below
        if (cancelled) return;

        setIsLoggedIn(true);
        
        if (typeof res.data?.user.name === "string") {
          localStorage.setItem("userName", res.data?.user.name);
          setName(res.data?.user.name);
        }
      } catch {
        if (cancelled) return;
        setIsLoggedIn(false);
      } finally {
        if (!cancelled) setIsAuthLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ isLoggedIn, isAuthLoading, login, logout, name, initials: getUserInitials(name) }),
    [isLoggedIn, isAuthLoading, name]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
