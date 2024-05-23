import React from "react";
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
      const response = await axios.post(`${config.url}/auth/signup`, data);
      console.log(response.data);
      // Handle successful response
    } catch (error) {
      console.error("There was an error!", error);
      // Handle error response
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className='container'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor='name'>Name</label>
          <input type='text' id='name' {...register("name")} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
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
        <button type='submit'>Sign Up</button>
      </form>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Signup;
