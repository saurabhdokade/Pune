import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaFacebookF, FaGoogle, FaApple } from "react-icons/fa";
import signupImg from "../assets/5774b1d8a66bd464021e86eb52c3b8dc230da000.png"; // Update to your image path
import Logo from "../components/Logo";
export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "john.doe@gmail.com",
    lastName: "john.doe@gmail.com",
    email: "john.doe@gmail.com",
    phone: "john.doe@gmail.com",
    password: "••••••••••••••",
    confirmPassword: "••••••••••••••",
    terms: false,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Add signup logic here
    console.log(formData);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-center items-center">
      <div className="w-full max-w-[1200px] mx-auto min-h-screen flex flex-col md:flex-row items-center px-2 py-8">
        {/* LEFT: Illustration */}
        <div className="hidden md:flex flex-1 justify-center items-center w-full md:w-1/2 mb-8 md:mb-0">
          <div className="bg-white rounded-2xl flex items-center justify-center w-[420px] h-[650px] relative shadow-none"
            style={{
              // Border removed as per your request
              // boxShadow: "0 0 0 1.5px #2196F3",
              padding: 0
            }}
          >
            <img
              src={signupImg}
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
        {/* RIGHT: Form */}
        <div className="flex-1 flex flex-col justify-center w-full md:w-1/2 px-2">
          {/* Logo top right on desktop */}
          <div className="flex items-center mb-10">
            <Logo size={38} />
            <span className="ml-3 font-bold text-xl text-[#264283] leading-tight flex flex-col">
              <span>CITY CENTER</span>
              <span>MALL</span>
            </span>
          </div>
          {/* Sign up Heading */}
          <h2 className="text-4xl font-semibold text-[#222] mb-2">Sign up</h2>
          <p className="text-[#5b5b5b] text-base mb-6">
            Let’s get you all st up so you can access your personal account.
          </p>
          {/* Form */}
          <form className="w-full max-w-[500px] flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Name (2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="firstName">
                  First Name
                </label>
                <input
                  className="w-full border border-[#bcbcbc] rounded-md px-3 py-2 font-medium focus:outline-none focus:border-[#264283] text-base"
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  className="w-full border border-[#bcbcbc] rounded-md px-3 py-2 font-medium focus:outline-none focus:border-[#264283] text-base"
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                />
              </div>
            </div>
            {/* Email + Phone (2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full border border-[#bcbcbc] rounded-md px-3 py-2 font-medium focus:outline-none focus:border-[#264283] text-base"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  className="w-full border border-[#bcbcbc] rounded-md px-3 py-2 font-medium focus:outline-none focus:border-[#264283] text-base"
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
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
            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="w-full border border-[#bcbcbc] rounded-md px-3 py-2 font-medium focus:outline-none focus:border-[#264283] text-base pr-10"
                type={showCPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute top-8 right-3 text-[#757575]"
                onClick={() => setShowCPassword((s) => !s)}
              >
                {showCPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {/* Terms */}
            <div className="flex items-center">
              <input
                type="checkbox"
                className="accent-[#264283] w-4 h-4 mr-2"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />
              <label htmlFor="terms" className="text-sm">
                I agree to all the <span className="text-[#FF3B3B]">Terms</span> and <span className="text-[#FF3B3B]">Privacy Policies</span>
              </label>
            </div>
            {/* Create account Button */}
            <button
              type="submit"
              className="w-full bg-[#264283] text-white font-semibold text-lg rounded-md py-2.5 mt-2 hover:bg-[#1f3662] transition"
            >
              Create account
            </button>
            {/* Already have account */}
            <div className="text-center text-sm">
              <span className="text-[#222]">Already have an account? </span>
              <a href="/login" className="text-[#FF3B3B] font-medium hover:underline">Login</a>
            </div>
            {/* Or sign up with separator */}
            <div className="flex items-center my-1">
              <div className="flex-1 h-px bg-[#e2e2e2]" />
              <span className="mx-2 text-xs text-[#888]">Or Sign up with</span>
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
      </div>
    </div>
  );
}