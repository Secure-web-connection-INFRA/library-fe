import React, { useState } from 'react';
import './LoginSignup.css';
import user_icon from './Assets/person.png';
import email_icon from './Assets/email.png';
import password_icon from './Assets/password.png';

const LoginSignup = () => {
    const [action, setAction] = useState("Login");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        rePassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isResetPassword, setIsResetPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isResetPassword) {
            // Reset password logic
            if (formData.password !== formData.rePassword) {
                setErrors({ rePassword: 'Passwords do not match' });
                return;
            }
            // Perform the password reset API call here
            console.log('Resetting password for:', formData.email);
        } else if (action === "Sign Up") {
            const newErrors = validateForm(formData);
            if (Object.keys(newErrors).length === 0) {
                try {
                    const url = "http://127.0.0.1:5000/auth/signup";
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });
                    const responseData = await response.json();
                    console.log(responseData);
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                setErrors(newErrors);
            }
        } else {
            try {
                const loginUrl = "http://127.0.0.1:5000/auth/login";
                const loginResponse = await fetch(loginUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });
                const loginData = await loginResponse.json();
                console.log(loginData);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const validateForm = (data) => {
        const errors = {};
        if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Valid email is required';
        }
        if (!data.password || data.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }
        if (action === "Sign Up" && (!data.name || data.name.trim().length === 0)) {
            errors.name = 'Name is required';
        }
        return errors;
    };

    const renderForm = () => (
        <>
            <div className="inputs">
                {action === "Sign Up" && (
                    <div className='input'>
                        <img src={user_icon} alt=' ' />
                        <input
                            placeholder='Name'
                            type='text'
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <div className="error">{errors.name}</div>}
                    </div>
                )}
                <div className="input">
                    <img src={email_icon} alt="Email" />
                    <input
                        type="email"
                        placeholder='Email ID'
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>
                <div className="input">
                    <img src={password_icon} alt="Password" />
                    <input
                        type="password"
                        placeholder='Password'
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>
                {isResetPassword && (
                    <>
                        <div className="input">
                            <img src={password_icon} alt="Re-enter Password" />
                            <input
                                type="password"
                                placeholder='Re-enter Password'
                                name="rePassword"
                                value={formData.rePassword}
                                onChange={handleChange}
                            />
                            {errors.rePassword && <div className="error">{errors.rePassword}</div>}
                        </div>
                    </>
                )}
            </div>
            {action === "Login" && !isResetPassword && (
                <div className="forgot-password">
                    Forgot Password?? <span onClick={() => setIsResetPassword(true)}>Click Here</span>
                </div>
            )}
            <div className="submit-container">
                {!isResetPassword ? (
                    <>
                        <button
                            type="submit"
                            className={action === "Sign Up" ? "submit" : "submit gray"}
                            onClick={() => setAction("Sign Up")}
                        >
                            Sign Up
                        </button>
                        <button
                            type="button"
                            className={action === "Login" ? "submit" : "submit gray"}
                            onClick={() => setAction("Login")}
                        >
                            Login
                        </button>
                    </>
                ) : (
                    <button
                        type="submit"
                        className="submit"
                    >
                        Enter
                    </button>
                )}
            </div>
        </>
    );

    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div className='header'>
                    <div className='text'>{isResetPassword ? "Reset Password" : action}</div>
                    <div className='underline'></div>
                </div>
                {renderForm()}
            </form>
        </div>
    );
}

export default LoginSignup;
