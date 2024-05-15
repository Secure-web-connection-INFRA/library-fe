import { useState } from 'react';
import './LoginSignup.css';
import user_icon from './Assets/person.png';
import email_icon from './Assets/email.png';
import password_icon from './Assets/password.png';

const LoginSignup = () => {
    const [action, setAction] = useState("Sign Up");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Optionally clear errors on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        if (Object.keys(newErrors).length === 0) {
            console.log('Form is valid: ', formData);
            // Handle form submission like sending data to a server
        } else {
            setErrors(newErrors);
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

    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div className='header'>
                    <div className='text'>{action}</div>
                    <div className='underline'></div>
                </div>
                <div className="inputs">
                    {action === "Sign Up" && (
                        <div className="input">
                            <img src={user_icon} alt="User" />
                            <input type="text" placeholder='Name' name="name" value={formData.name} onChange={handleChange} />
                            {errors.name && <div className="error">{errors.name}</div>}
                        </div>
                    )}
                    
                    <div className="input">
                        <img src={email_icon} alt="Email" />
                        <input type="email" placeholder='Email ID' name="email" value={formData.email} onChange={handleChange} />
                        {errors.email && <div className="error">{errors.email}</div>}
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="Password" />
                        <input type="password" placeholder='Password' name="password" value={formData.password} onChange={handleChange} />
                        {errors.password && <div className="error">{errors.password}</div>}
                    </div>
                </div>
                <div className="submit-container">
                    <button type="submit" className={action === "Login" ? "submit gray" : "submit"}>Sign Up</button>
                    <button type="button" className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>Login</button>
                </div>
                {action !== "Sign Up" && (
                    <div className="forgot-password">
                        Lost Password ? <span>Click Here!</span>
                    </div>
                )}
            </form>
        </div>
    );
}

export default LoginSignup;
