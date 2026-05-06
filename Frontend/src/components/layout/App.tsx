import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout.tsx";
import Navbar from "./Navbar.tsx";
import { useAuth } from "../../auth/AuthContext.tsx";

const PUBLIC_PATHS = ['/', '/login', '/signup'];

const App: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (PUBLIC_PATHS.includes(location.pathname)) {
    return <Outlet />;
  }

  return (
    <AppLayout>
      <Navbar onLogout={handleLogout} />
      <Outlet />
    </AppLayout>
  );
};

export default App;
