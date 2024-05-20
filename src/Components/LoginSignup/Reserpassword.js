import React, { useState } from 'react';
import './LoginSignup.css';
import email_icon from './Assets/email.png';
import password_icon from './Assets/password.png';

const Reset_Password = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  // handlers
  const handleChange = (e) => { /* same as before */ };
  const handleSubmit = async (e) => { /* implementation specific for login */ };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <div className='header'>
          <div className='text'>Reset Password</div>
          <div className='underline'></div>
        </div>
        {/* Form inputs for login */}
      </form>
    </div>
  );
}

export default Login;
