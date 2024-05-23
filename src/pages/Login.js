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
    } catch (error) {
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
    const response = await axios.post(`${config.url}/auth/otp`, data);
    if (response.status) {
      localStorage.setItem("jwt", response.data.jwtToken);
      localStorage.setItem("username", response.data.userName);
      navigate("/dashboard");
    }
  };

  if (isotp) {
    return (
      <div>
        <h1>OTP</h1>
        <div>{isotp}</div>
        {otp.map((digit, index) => (
          <input
            key={index}
            type='text'
            maxLength='1'
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onPaste={handlePaste}
            ref={inputRefs[index]}
            style={{ width: 10, margin: 10 }}
          />
        ))}
        <button onClick={handleOtp}>Submit</button>
      </div>
    );
  }

  return (
    <div className='container'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <p>
          Forgot Password?{" "}
          <span className='link' onClick={handleResetPassword}>
            {" "}
            Click Here
          </span>
        </p>
        <button type='submit'>Login</button>
      </form>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default Login;
