import React, {useState, useEffect, useRef} from "react";
import "./styles/AppLayout.css";

import Button from "./sharedComponents/Button";

import { useNavigate } from "react-router-dom";

import ProfileDetailsComponent from "./ProfileDetailsComponent";

// React Icons
import { useAuth } from "../auth/AuthContext";
import { AiOutlineLogout } from "react-icons/ai";

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
  const { name, initials } = useAuth();

  // Dummy user details for profile component
  const email = "user@example.com";
  const userAvatarUrl = "https://picsum.photos/200"; 
  const joinDate = "January 2023";
  const location = "Noida, India";
  const role = "Associate Software Engineer";

  const navigate = useNavigate();

  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const profileDetailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {
      if (profileDetailsRef.current && !profileDetailsRef.current.contains(event.target as Node)) {
        setShowProfileDetails(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="AppLayout">
        <header className="AppHeader">
          <div className="Logo">
            {/* <h1>TBoard</h1> */}
            <span>
              <img src="src/assets/TBoard-LOGO-landscape.png" alt="App LOGO" />
            </span>
          </div>
          {isLoggedIn ? (
            <div className="userInfo">
              <div className="userIconUserDetails-wrapper" ref={profileDetailsRef}>
                <div
                  className="userInitial"
                  onClick={() => setShowProfileDetails((prev) => !prev)}
                  aria-label="User avatar"
                  title={name ?? ""} //will show the name on hover
                >
                  {userAvatarUrl ? <img src={userAvatarUrl} alt={name ?? "user Name"} className="avatar-image" /> :
                  initials}
                </div>
                {showProfileDetails && (
                  <div className="userDetails">
                    <ProfileDetailsComponent setShowProfileDetails={setShowProfileDetails} userInfo={{ email, joinDate, location, role, userAvatarUrl }} onLogout={onLogout} />
                  </div>
                )}
              </div>
              {/* <div className="logOutButton">
                <AiOutlineLogout className="logOutIcon" onClick={onLogout} />
                <span>Logout</span>
              </div> */}
            </div>
          ) : (
            <div className="login-signup-buttons">
              <Button
                onClick={() =>
                  navigate("/loginSignup", { state: { mode: "login" } })
                }
                buttonText="Login"
              />
              <Button
                onClick={() =>
                  navigate("/loginSignup", { state: { mode: "signup" } })
                }
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
