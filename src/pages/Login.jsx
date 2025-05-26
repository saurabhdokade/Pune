import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaFacebookF, FaGoogle, FaApple } from "react-icons/fa";
import secureLoginImg from "../assets/f031e5b1caa0632b7cb3d2dc29294fc91b0a771f.png"; // Update as needed

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // For demonstration, you may want to add state for email/password
  const [formData, setFormData] = useState({
    email: "john.doe@gmail.com",
    password: "••••••••••••••",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your authentication logic here!
    // On success:
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-center items-center">
      <div className="w-full max-w-[1200px] mx-auto min-h-screen flex items-center px-2 py-8">
        {/* LEFT: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center pl-2 md:pl-10">
          {/* Logo */}
          <div className="flex items-center mb-10">
            <svg width={38} height={38} fill="none" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="20" fill="#E6EDFF"/>
              <g>
                <circle cx="20" cy="17" r="7" stroke="#264283" strokeWidth="2"/>
                <rect x="19" y="13" width="2" height="5" rx="1" fill="#264283"/>
                <rect x="17" y="18" width="6" height="2" rx="1" fill="#264283"/>
              </g>
            </svg>
            <span className="ml-3 font-bold text-xl text-[#264283] leading-tight flex flex-col">
              <span>CITY CENTER</span>
              <span>MALL</span>
            </span>
          </div>
          {/* Login Heading */}
          <h2 className="text-4xl font-semibold text-[#222] mb-3">Login</h2>
          <p className="text-[#5b5b5b] text-base mb-7">
            Login to access your travelwise&nbsp;<span className="font-medium">account</span>
          </p>
          {/* Form */}
          <form
            className="w-full max-w-[430px] flex flex-col gap-5"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            {/* Email */}
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
                autoComplete="username"
              />
            </div>
            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Password
              </label>
              <input
                className="w-full border border-[#bcbcbc] rounded-md px-3 py-2 font-medium focus:outline-none focus:border-[#264283] text-base pr-10"
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute top-8 right-3 text-[#757575]"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm font-medium text-[#222]">
                <input type="checkbox" className="accent-[#264283] w-4 h-4 mr-2" />
                Remember me
              </label>
              <a href="#" className="text-xs text-[#FF3B3B] font-medium hover:underline">
                Forgot Password
              </a>
            </div>
            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#264283] text-white font-semibold text-lg rounded-md py-2.5 hover:bg-[#1f3662] transition"
            >
              Login
            </button>
            {/* Sign up */}
            <div className="text-center text-sm">
              <span className="text-[#222]">Don’t have an account? </span>
              <a href="/signup" className="text-[#FF3B3B] font-medium hover:underline">Sign up</a>
            </div>
            {/* Or login with separator */}
            <div className="flex items-center my-1">
              <div className="flex-1 h-px bg-[#e2e2e2]" />
              <span className="mx-2 text-xs text-[#888]">Or login with</span>
              <div className="flex-1 h-px bg-[#e2e2e2]" />
            </div>
            {/* Social Buttons */}
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
            <img
              src={secureLoginImg}
              alt="Secure Login Illustration"
              className="bg-[#F6F6F6] rounded-2xl flex items-center justify-center w-[440px] h-[540px] relative"
              draggable={false}
            />
            {/* Carousel dots (static for now s) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              <span className="h-[6px] w-[18px] rounded-lg bg-[#757CFF]" />
              <span className="h-[6px] w-[6px] rounded-full bg-[#D1D5DB]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}