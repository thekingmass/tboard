import React from "react";
import "./styles/AppLayout.css";

import Button from "./sharedComponents/Button";

import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../auth/AuthContext";

import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  isLoggedIn,
  onLogout,
}) => {
  const { name } = useAuth();
  const navigate = useNavigate();

  const initials = React.useMemo(() => {
    const full = (name ?? "").trim();
    if (!full) return "?";
    const parts = full.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0][0]!.toUpperCase();
    const first = parts[0][0] ?? "";
    const last = parts[parts.length - 1][0] ?? "";
    return (first + last).toUpperCase();
  }, [name]);

  return (
    <>
      <div className="AppLayout">
        <header className="AppHeader">
          <div className="Logo">
            {/* <h1>TBoard</h1> */}
            <span><img src="src/assets/TBoard-LOGO-landscape.png" alt="App LOGO" /></span>
          </div>
          {isLoggedIn ? (
            <div className="userInfo">
              <div className="userInitial" onClick={() => navigate("/projects")} aria-label="User avatar" title={name ?? ""}>
                {initials}
              </div>
              <div className="logOutButton">
                <FiLogOut className="logOutIcon" onClick={onLogout}/>
              </div>
            </div>
          ) : (
            <div className="login-signup-buttons">
              <Button
                onClick={() => navigate("/loginSignup" , { state: { mode: "login" } })}
                buttonText="Login"
              />
              <Button
                onClick={() => navigate("/loginSignup", { state: { mode: "signup" } })}
                buttonText="Sign Up"
              />
            </div>
          )}
        </header> 
        <main className="AppMain">
          <div className="MainContainer">{children}</div>
        </main>
        {/* <footer className="AppFooter">
          <p>© {new Date().getFullYear()} TBoard</p>
        </footer> */}
      </div>
    </>
  );
};

export default AppLayout;
