import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../LoginForm.css"; // Import the CSS file
import { config } from "../constant";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Signup = () => {
  const [error, setError] = useState();
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
      await axios.post(`${config.url}/auth/signup`, data);
      setError("");
    } catch (error) {
      setError(error.response.data);
      console.error("There was an error!", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className='container'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label htmlFor='name'>Name</label>
          <input type='text' id='name' {...register("name")} />
        </div>
        {errors.name && <p>{errors.name.message}</p>}
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
        {errors.email && <p>{errors.email.message}</p>}
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
        {errors.password && <p>{errors.password.message}</p>}
        <button type='submit'>Sign Up</button>
        {error && <p style={{ fontSize: 12 }}>{error}</p>}
      </form>
      <div style={{ padding: 10, textAlign: "center" }}>
        Already have account?
        <span
          className='link'
          style={{
            cursor: "pointer",
            fontWeight: 600,
            textAlign: "center",
            padding: 10,
            color: "#42006c",
          }}
          onClick={handleLogin}
        >
          Login
        </span>
      </div>
    </div>
  );
};

export default Signup;
