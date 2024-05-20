import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css"; // Import the CSS file
import { config } from "../../constant";

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
      console.log(response.data);
      // Handle successful response, e.g., navigate to the dashboard
      navigate("/dashboard"); // Assuming there's a dashboard route
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

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <p>
          Forgot Password?{" "}
          <span className="link" onClick={handleResetPassword}>
            {" "}
            Click Here
          </span>
        </p>
        <button type="submit">Login</button>
      </form>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default Login;
