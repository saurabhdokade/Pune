import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaFacebookF, FaGoogle, FaApple } from "react-icons/fa";
import Logo from "../components/Logo";
import axios from "axios";
import secureLoginImg from "../assets/f031e5b1caa0632b7cb3d2dc29294fc91b0a771f.png";
import { useAuth } from "../components/AuthContext"; // <-- Import useAuth

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- Use the login method from AuthContext

  // Default values (from your example)
  const [formData, setFormData] = useState({
    username: "john_doe_admin",
    email: "john.doe@example.com"
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);
    try {
      // API expects: { username, email }
      const response = await axios.post(
        "https://api.citycentermall.com/api/v1/super-admin/signin",
        {
          username: formData.username,
          email: formData.email,
        }
      );
      // Handle successful login (access_token, etc.)
      if (response.data && response.data.access_token) {
        // Use AuthContext's login function, not just localStorage
        login(response.data.access_token, { username: formData.username, email: formData.email });
        navigate("/dashboard");
      } else {
        setApiError("No access token received. Please try again.");
      }
    } catch (error) {
      setApiError(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-center items-center">
      <div className="w-full max-w-[1200px] mx-auto min-h-screen flex items-center px-2 py-8">
        {/* LEFT: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center pl-2 md:pl-10">
          {/* Logo */}
          <div className="flex items-center mb-10">
            <Logo size={38} />
            <span className="ml-3 font-bold text-xl text-[#264283] leading-tight flex flex-col">
              <span>CITY CENTER</span>
              <span>MALL</span>
            </span>
          </div>
          {/* Login Heading */}
          <h2 className="text-4xl font-semibold text-[#222] mb-3">Login</h2>
          <p className="text-[#5b5b5b] text-base mb-7">
            Login to access your admin&nbsp;<span className="font-medium">account</span>
          </p>
          <form
            className="w-full max-w-[430px] flex flex-col gap-5"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="username">
                Username
              </label>
              <input
                className="w-full border border-[#bcbcbc] rounded-md px-3 py-2 font-medium focus:outline-none focus:border-[#264283] text-base"
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                className="w-full border border-[#bcbcbc] rounded-md px-3 py-2 font-medium focus:outline-none focus:border-[#264283] text-base"
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
            {/* API error message */}
            {apiError && (
              <div className="text-red-500 text-sm">{apiError}</div>
            )}
            <button
              type="submit"
              className={`w-full bg-[#264283] text-white font-semibold text-lg rounded-md py-2.5 hover:bg-[#1f3662] transition ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="text-center text-sm">
              <span className="text-[#222]">Don’t have an account? </span>
              <a href="/signup" className="text-[#FF3B3B] font-medium hover:underline">Sign up</a>
            </div>
            <div className="flex items-center my-1">
              <div className="flex-1 h-px bg-[#e2e2e2]" />
              <span className="mx-2 text-xs text-[#888]">Or login with</span>
              <div className="flex-1 h-px bg-[#e2e2e2]" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                className="flex items-center justify-center border border-[#757CFF] bg-white rounded-md py-3 text-xl hover:bg-[#f7f7fd] transition"
              >
                <FaFacebookF className="text-[#1877F3]" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center border border-[#757CFF] bg-white rounded-md py-3 text-xl hover:bg-[#f7f7fd] transition"
              >
                <FaGoogle className="text-[#EA4335]" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center border border-[#757CFF] bg-white rounded-md py-3 text-xl hover:bg-[#f7f7fd] transition"
              >
                <FaApple className="text-[#111]" />
              </button>
            </div>
          </form>
        </div>
        {/* RIGHT: Illustration */}
        <div className="hidden md:flex w-1/2 justify-center items-center">
          <div className="bg-[#F6F6F6] rounded-2xl flex items-center justify-center w-[440px] h-[540px] relative">
            <div className="hidden md:flex flex-1 justify-center items-center w-full md:w-1/2 mb-8 md:mb-0">
              <div className="bg-white rounded-2xl flex items-center justify-center w-[420px] h-[650px] relative shadow-none"
                style={{
                  padding: 0
                }}
              >
                <img
                  src={secureLoginImg}
                  alt="Signup Illustration"
                  className="bg-[#F6F6F6] rounded-2xl flex items-center justify-center w-[440px] h-[640px] relative"
                  draggable={false}
                  style={{ marginTop: 0, marginBottom: 0 }}
                />
                {/* Carousel dots */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                  <span className="h-[6px] w-[18px] rounded-lg bg-[#757CFF]" />
                  <span className="h-[6px] w-[6px] rounded-full bg-[#D1D5DB]" />
                  <span className="h-[6px] w-[6px] rounded-full bg-[#D1D5DB]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}