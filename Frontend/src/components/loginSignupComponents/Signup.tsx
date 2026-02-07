import React, { useState } from "react";
import "./Signup.css";

import axios from 'axios';

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
      alert("Please enter a valid email address.");
      return;
    }
    console.log({ signupName, signupEmail, signupPassword });

    // console.log("matchPasswords check:", signupPassword === signupConfirmPassword);

    if (signupPassword !== signupConfirmPassword) {
      console.error("Passwords do not match");
      alert("Passwords do not match. Please try again.");
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
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data;

      const message =
        typeof data === "string" ? data : data?.message ?? "Signup failed. Please try again.";

      // Your backend sends: res.status(400).json({ message: "User already exists" })
      if (status === 400 && message.toLowerCase().includes("already exists")) {
        alert("An account with this email already exists. Please log in instead.");
        return;
      }

      alert(message);
      return;
    }

    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    alert(`Hi ${signupName}, Signup successful! Please log in`);


  };

  return (
    <div className="signUpFormContainer formContainer">
      <form className="signUpForm" onSubmit={handleSignupSubmit}>
        <div className="form-group">
            <label htmlFor="signupName">Name:</label>
            <input
              type="text"
              id="signupName"
              name="signupName"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              required
            />
        </div>
        <div className="form-group">
            <label htmlFor="signupEmail">Email:</label>
            <input
              type="email"
              id="signupEmail"
              name="signupEmail"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
        </div>
        <div className="form-group">
            <label htmlFor="signupPassword">Password:</label>
            <input
              type="password"
              id="signupPassword"
              name="signupPassword"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
        </div>
        <div className="form-group">
            <label htmlFor="signupConfirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="signupConfirmPassword"
              name="signupConfirmPassword"
              value={signupConfirmPassword}
              onChange={(e) => setSignupConfirmPassword(e.target.value)}
              required
            />
        </div>
        <div className="form-group">
            <button type="submit" className="signupButton">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
