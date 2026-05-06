import React from "react";

import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "sonner";
import Box from "@mui/material/Box";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";

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
    } catch (err: unknown) {
      const requestError = err as { response?: { status?: number; data?: unknown } };
      const status = requestError.response?.status;
      const data = requestError.response?.data;
      console.log(status, data);
      toast.error("Login failed. Please check your credentials and try again.");
      return;
    }
  };

  return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2, py: 4 }}>
      <Paper sx={{ borderRadius: 3, p: { xs: 3, md: 4 }, width: '100%', maxWidth: 460, border: "1px solid rgba(148,163,184,0.2)", bgcolor: "rgba(255,255,255,0.84)" }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" color="secondary.main">Welcome back</Typography>
            <Typography variant="h4" gutterBottom>Login to Tboard</Typography>
            <Typography variant="body1" color="text.secondary">Access your projects, tasks, and team board from one place.</Typography>
          </Box>
        <Box component='form' onSubmit={handleLoginSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', margin: '0 auto' }}>
          <TextField
            name='email'
            label='Email'
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)} required />
          <TextField
            name='password'
            label='Password'
            type='password'
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required />
          <Button variant='contained' color='primary' type='submit'>
            Login
          </Button>
          <Typography component={Link} to="/signup" sx={{ textAlign: 'center', color: 'primary.main', fontWeight: 700 }}>
            Don't have an account? Sign Up
          </Typography>
        </Box>
        </Stack>
      </Paper>
    </Box>
  );
};
export default Login;
