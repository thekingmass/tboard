import React, { useEffect } from "react";
import { BiSolidToggleLeft } from "react-icons/bi";
import { BiSolidToggleRight } from "react-icons/bi";

import { useLocation, useNavigate } from "react-router-dom";

import "./loginSignup.css";
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";  

interface LoginSignupProps {
    isLoggedIn: boolean;
}

const LoginSignup: React.FC<LoginSignupProps> = ({ isLoggedIn }) => {

    const [isLoginVisible, setIsLoginVisible] = React.useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // If we were navigated here via the header "Sign Up" button,
    // open the signup form immediately.
    useEffect(() => {
        const mode = (location.state as any)?.mode as string | undefined;
        if (mode === "signup") setIsLoginVisible(false);
        if (mode === "login") setIsLoginVisible(true);
    }, [location.state]);

    useEffect (() => {
        if (!isLoggedIn) return;
        const fallbackPath = "/";
        const fromPath = (location.state as any)?.from?.pathname as
            | string
            | undefined;
        navigate(fromPath || fallbackPath, { replace: true });
    }, [isLoggedIn, location.state, navigate]);

    return (
        <div className="login-signup-container">
            <div className="toggle-buttons">
                <h2>Login</h2>
                {isLoginVisible ? (
                    <BiSolidToggleLeft
                        className="toggle-icon"
                        onClick={() => setIsLoginVisible(false)}
                    />
                ) : (
                    <BiSolidToggleRight
                        className="toggle-icon"
                        onClick={() => setIsLoginVisible(true)}
                    />
                )}
                <h2>Sign Up</h2>
            </div>
            <div className="form-container">
                {isLoginVisible ? <Login /> : <Signup />}
            </div>
        </div>
    )

    
}

export default LoginSignup;