import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import "../LoginForm.css"; // Import the CSS file
import { config } from "../constant";

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ForgetPassword = () => {
  const [response, setResponse] = useState("");
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
        `${config.url}/auth/forget-password`,
        data
      );
      setResponse(response.data);
      // Handle successful response, e.g., show a success message
    } catch (error) {
      console.error("There was an error!", error);
      // Handle error response
    }
  };

  return (
    <div className='container'>
      <h1>Forget Password</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <button type='submit'>Reset Link</button>
      </form>
      {response}
    </div>
  );
};

export default ForgetPassword;
