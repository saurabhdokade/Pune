import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css'; 

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="signup-container">
      <div className="signup-grid">

        {/* Right Side Form */}
        <div className="signup-box">
          <h2 className="signup-title">Create Account</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="input-group">
              <label htmlFor="name" className="input-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label htmlFor="email" className="input-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <button type="submit" className="submit-btn">Sign Up</button>
          </form>

          <p className="login-link">
            Already have an account?{' '}
            <span className="link-text" onClick={() => navigate('/login')}>
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
