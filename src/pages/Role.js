import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { config } from "../constant";
import "../role.css";

const RoleChangeForm = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`${config.url}/lib/role-change`, null, {
        params: { email, role },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(`Role updated successfully: ${response.data}`);
      setIsError(false);
    } catch (error) {
      setMessage(
        `Error updating role: ${
          error.response ? error.response.data : error.message
        }`
      );
      setIsError(true);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("token") ?? false;
    const role = localStorage.getItem("role") ?? false;
    if (storedData && role === "ADMIN") {
      setToken(storedData);
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className='form-container'>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          gap: 20,
        }}
      >
        <div
          style={{
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value='USER'>USER</option>
            <option value='ADMIN'>ADMIN</option>
          </select>
        </div>
        <button type='submit'>Submit</button>
      </form>
      {message && (
        <p className={`message ${isError ? "error" : "success"}`}>{message}</p>
      )}
    </div>
  );
};

export default RoleChangeForm;
