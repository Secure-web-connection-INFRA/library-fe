import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../constant";

const schema = yup
  .object({
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  })
  .required();

const ResetPassword = () => {
  const [response, setResponse] = useState("");
  const [error, setError] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { token } = useParams(); // Extracting token from URL
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(`${config.url}/auth/reset`, {
        token,
        password: data.password,
      });
      setResponse(response.data);
      navigate("/login"); // Redirect after successful password reset
      setError("");
    } catch (error) {
      setError(error.response.data);
      console.error("Reset password error:", error);
    }
  };

  return (
    <div className='container'>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label htmlFor='password'>New Password</label>
          <input type='password' id='password' {...register("password")} />
        </div>
        {errors.password && (
          <p style={{ fontSize: 12 }}>{errors.password.message}</p>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            type='password'
            id='confirmPassword'
            {...register("confirmPassword")}
          />
        </div>
        {errors.confirmPassword && (
          <p style={{ fontSize: 12 }}>{errors.confirmPassword.message}</p>
        )}
        {error && <p style={{ fontSize: 12 }}>{error}</p>}
        <button type='submit'>Reset Password</button>
        {response && <div> {response}. Reset using the link.</div>}
      </form>
    </div>
  );
};

export default ResetPassword;
