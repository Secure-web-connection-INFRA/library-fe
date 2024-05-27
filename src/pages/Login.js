import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../LoginForm.css"; // Import the CSS file
import { config } from "../constant";

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const [isotp, setisOtp] = useState(false);
  const [error, setError] = useState(false);
  const [otp, setOTP] = useState(["", "", "", ""]);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${config.url}/auth/login`, data);
      if (response.status === 200) {
        setisOtp(response.data);
      }
      setError("");
    } catch (error) {
      setError(error.response.data);
      console.error("There was an error!", error);
      // Handle error response
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleResetPassword = () => {
    navigate("/forget-password");
  };

  const handleChange = (index, value) => {
    if (!isNaN(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);

      // Focus next input field if value is not empty
      if (value !== "" && index < 3) {
        inputRefs[index + 1].current.focus();
      }
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").trim();
    const newOTP = [...otp];

    // Ensure pasted data is numeric and has length <= 4
    if (/^\d+$/.test(pasteData) && pasteData.length <= 4) {
      // Update OTP state with pasted data
      for (let i = 0; i < pasteData.length; i++) {
        if (i < 4) {
          newOTP[i] = pasteData[i];
        }
      }
      setOTP(newOTP);
    }
  };

  const handleOtp = async () => {
    const data = {
      email: isotp.slice(21),
      otp: otp.join(""),
    };
    try {
      const response = await axios.post(`${config.url}/auth/otp`, data);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.jwtToken);
        localStorage.setItem("username", response.data.userName);
        navigate("/dashboard");
      } else {
        alert(response.data);
      }
      setError("");
    } catch (error) {
      setError(error.response.data);
    }
  };

  if (isotp) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "white", fontWeight: 600 }}>
          <h1>OTP</h1>
          <div>{isotp}</div>
        </div>
        {otp.map((digit, index) => (
          <input
            key={index}
            type='text'
            maxLength='1'
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onPaste={handlePaste}
            ref={inputRefs[index]}
            style={{ minWidth: 10, maxWidth: 20, margin: 10 }}
          />
        ))}
        {error && <p style={{ fontSize: 12 }}>{error}</p>}
        <div>
          <button onClick={handleOtp}>Submit</button>
        </div>
      </div>
    );
  }

  return (
    <div className='container'>
      <h1>Login</h1>
      <form style={{ textAlign: "right" }} onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' {...register("email")} />
        </div>
        {errors.email && <p style={{ fontSize: 12 }}>{errors.email.message}</p>}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' {...register("password")} />
        </div>
        {errors.password && (
          <p style={{ fontSize: 12 }}>{errors.password.message}</p>
        )}
        {error && <p style={{ fontSize: 12 }}>{error}</p>}
        <button type='submit'>Login</button>
      </form>
      <div
        className='link'
        style={{
          cursor: "pointer",
          fontWeight: 600,
          textAlign: "center",
          padding: 10,
        }}
        onClick={handleResetPassword}
      >
        Forgot Password?
      </div>
      <hr />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            cursor: "pointer",
            border: "2px solid #3a2dbb",
            borderRadius: 4,
            padding: 5,
            fontWeight: 700,
            color: "#8600c2",
          }}
          onClick={handleSignUp}
        >
          Create an account
        </div>
      </div>
    </div>
  );
};

export default Login;
