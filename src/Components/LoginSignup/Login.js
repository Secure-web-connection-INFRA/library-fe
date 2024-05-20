// src/LoginForm.js
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import "./LoginForm.css"; // Import the CSS file

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

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://your-api-endpoint.com/login",
        data
      );
      console.log(response.data);
      // Handle successful response
    } catch (error) {
      console.error("There was an error!", error);
      // Handle error response
    }
  };

  return (
    <div className='container'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name</label>
          <input type='text' {...register("name")} />
          <p>{errors.name?.message}</p>
        </div>
        <div>
          <label>Email</label>
          <input type='email' {...register("email")} />
          <p>{errors.email?.message}</p>
        </div>
        <div>
          <label>Password</label>
          <input type='password' {...register("password")} />
          <p>{errors.password?.message}</p>
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default LoginForm;
