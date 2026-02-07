import React from "react";
import "./Login.css";

import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "sonner";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log({ loginEmail, loginPassword });
    try {
      const loginResponse = await api.post("/api/login", {
        loginEmail: loginEmail,
        loginPassword: loginPassword,
      });

      if (!loginResponse || loginResponse.status !== 200) {
        toast.error(
          "Login failed. Please check your credentials and try again.",
        );
        return;
      }

      const userName: string = loginResponse.data?.name;
      login(userName);

      toast.success(`Welcome${userName ? ` ${userName}` : ""}!`);

      console.log("User Name", userName);

      // Navigate to the Projects page after successful login
      setLoginEmail("");
      setLoginPassword("");
      navigate("/projects");
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.log(status, data);
      toast.error("Login failed. Please check your credentials and try again.");
      return;
    }
  };

  return (
    <div className="loginFormContainer formContainer">
      <form className="loginForm" onSubmit={handleLoginSubmit}>
        <div className="form-group">
          <label htmlFor="loginEmail">Email:</label>
          <input
            type="email"
            id="loginEmail"
            name="loginEmail"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="loginPassword">Password:</label>
          <input
            type="password"
            id="loginPassword"
            name="loginPassword"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="loginButton">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};
export default Login;
