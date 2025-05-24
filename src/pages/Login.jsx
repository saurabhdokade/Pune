import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'; 

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
     navigate('/dashboard'); // Uncomment to redirect
  };

  return (
    <div className="login-container">
      <div className="login-grid">

        <div className="login-box">
          <h2 className="login-title">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>

          <p className="signup-link">
            Don't have an account?{' '}
            <span
              className="link-text"
              onClick={() => navigate('/signup')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate('/signup');
              }}
            >
              Sign up here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
