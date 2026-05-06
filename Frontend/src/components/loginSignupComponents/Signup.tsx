import React, { useState } from "react";
import {toast} from "sonner";

import axios from 'axios';
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Signup: React.FC = () => {
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /^[A-Za-z](?:[0-9A-Za-z._-]*[A-Za-z0-9._-])@[A-Za-z]{1,10}\.[A-Za-z]{1,3}$/;
    const isValidEmail = emailRegex.test(signupEmail);
    if (!isValidEmail) {
      toast.warning("Invalid email format");
      return;
    }
    console.log({ signupName, signupEmail, signupPassword });

    // console.log("matchPasswords check:", signupPassword === signupConfirmPassword);

    if (signupPassword !== signupConfirmPassword) {
      console.error("Passwords do not match");
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/signup', {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error: unknown) {
      const requestError = error as { response?: { status?: number; data?: { message?: string } | string } };
      const status = requestError.response?.status;
      const data = requestError.response?.data;

      const message =
        typeof data === "string" ? data : data?.message ?? "Signup failed. Please try again.";

      // Your backend sends: res.status(400).json({ message: "User already exists" })
      if (status === 400 && message.toLowerCase().includes("already exists")) {
        toast.error("An account with this email already exists. Please log in instead.");
        return;
      }

      toast.error(message);
      return;
    }

    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    toast.success(`Hi ${signupName}, Signup successful! Please log in`);


  };
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2, py: 4 }}>
    <Paper sx={{ borderRadius: 3, p: { xs: 3, md: 4 }, width: '100%', maxWidth: 460, border: "1px solid rgba(148,163,184,0.2)", bgcolor: "rgba(255,255,255,0.84)" }} >
      <Stack spacing={3}>
      <Box>
        <Typography variant="overline" color="secondary.main">Create account</Typography>
        <Typography variant="h4" gutterBottom>Join Tboard</Typography>
        <Typography variant="body1" color="text.secondary">Start organizing project work with a cleaner dashboard and board workflow.</Typography>
      </Box>
      <Box component='form' onSubmit={handleSignupSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', margin: '0 auto' }}>
        <TextField
          name='signupName'
          label='Name'
          value={signupName}
          onChange={(e) => setSignupName(e.target.value)} required />
        <TextField
          name='signupEmail'
          label='Email'
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)} required />
        <TextField
          name='signupPassword'
          label='Password'
          type='password'
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)} required />
        <TextField
          name='signupConfirmPassword'
          label='Confirm Password'
          type='password'
          value={signupConfirmPassword}
          onChange={(e) => setSignupConfirmPassword(e.target.value)} required />
        <Button variant='contained' color='primary' type='submit'>
          Signup
        </Button>
        <Typography component={Link} to="/login" sx={{ textAlign: 'center', color: 'primary.main', fontWeight: 700 }}>
          Already have an account? Log In
        </Typography>
      </Box>
      </Stack>
    </Paper >
    </Box>

  );
};

export default Signup;
