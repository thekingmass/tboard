import React from "react";

import AppLayout from "./components/AppLayout.tsx";
import { Route, Routes } from "react-router-dom";
import ProjectComponents from "./components/ProjectComponents.tsx";
import ProjectBoard from "./components/BoardComponents/ProjectBoard.tsx";
import LoginSignup from "./components/loginSignupComponents/LoginSignup.tsx";

import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import { useAuth } from "./auth/AuthContext";
import { useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage.tsx";

export const App: React.FC = () => {

  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoOut = () => {
    logout();
    navigate("/", { replace: true });
  };
  
  return (
    <>
      <AppLayout isLoggedIn={isLoggedIn} onLogout={handleLogoOut}>
      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/loginSignup" element={<LoginSignup isLoggedIn={isLoggedIn} />} />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectComponents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectBoard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppLayout>
    </>
  )
}

export default App;
