// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";
import { AuthContext } from "../components/AuthContext"; 

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://api.citycentermall.com/api/v1/auth/email",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.success && response.data.data) {
        const { user, store } = response.data.data;
console.log("User data:", user);
        if (user && user.id) {
          const fullUserData = { ...user, store }; // Combine user and store
          login(fullUserData); // Save to context & localStorage
          navigate("/dashboard");
        } else {
          setError("User data missing in response.");
        }
      } else {
        setError(response.data?.message || "Login failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed.");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-grid">
        <div className="image-container">
          <img src="/images/signup&login.png" alt="Login" className="login-image" />
        </div>

        <div className="login-box">
          <h2 className="login-title">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="login-form">
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

            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="signup-link">
            Don't have an account?{" "}
            <span className="link-text" onClick={() => navigate("/signup")}>
              Sign up here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
