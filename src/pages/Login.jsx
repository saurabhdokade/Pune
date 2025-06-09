import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaGoogle, FaApple } from "react-icons/fa";
import Logo from "../components/Logo";
import axios from "axios";
import secureLoginImg from "../assets/f031e5b1caa0632b7cb3d2dc29294fc91b0a771f.png";
import { useAuth } from "../components/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]); // 4 columns for OTP
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Create refs for OTP inputs
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  // Helper: decode JWT token (base64 decode, no validation)
  function decodeJWT(token) {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch {
      return {};
    }
  }

  // Step 1: Request OTP (handles both success and "mobile not registered" from API)
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.citycentermall.com/api/v1/auth/otp/${mobile.replace(/[,\s]/g, "")}`
      );
      if (res.data && res.data.success === false) {
        setApiError(res.data.message || "Mobile number is not registered, please signup");
        toast.error(res.data.message || "Mobile number is not registered, please signup");
      } else {
        setStep(2);
        setOtp(["", "", "", ""]);
        if (res.data.otp) {
          toast.success(`OTP sent successfully! Your OTP is ${res.data.otp}`);
        } else {
          toast.success("OTP sent successfully!");
        }
        // Focus on first OTP input
        setTimeout(() => {
          if (otpRefs[0].current) otpRefs[0].current.focus();
        }, 100);
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Mobile number is not registered, please signup";
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP, handle token, role, and user object
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);
    const otpString = otp.join("");
    try {
      const res = await axios.get(
        `https://api.citycentermall.com/api/v1/auth/verify-otp`,
        {
          params: { mobile_no: mobile.replace(/[,\s]/g, ""), otp: otpString }
        }
      );

      // Handle the new response structure with "success", "token", and "user"
      if (res.data && res.data.success && res.data.token && res.data.user) {
        // Check role for SUPER_ADMIN
        if (
          res.data.user.role &&
          res.data.user.role.replace(/[, ]+/g, "") === "SUPER_ADMIN"
        ) {
          toast.success("Login successful!");
          // Pass both token and user object to login context
          login(res.data.token, res.data.user);
          navigate("/dashboard");
        } else {
          toast.error("You do not have SUPER_ADMIN access.");
          setApiError("You do not have SUPER_ADMIN access.");
        }
      } else {
        // Show backend message or generic
        const msg =
          res.data?.message && res.data.message !== "OTP verified successfully"
            ? res.data.message
            : "Invalid OTP or you are not authorized to login.";
        toast.error(msg);
        setApiError(msg);
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid OTP or OTP expired";
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // OTP Input Handlers
  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) {
      setOtp((prev) => {
        const newOtp = [...prev];
        newOtp[idx] = "";
        return newOtp;
      });
      return;
    }
    if (value.length === 1) {
      setOtp((prev) => {
        const newOtp = [...prev];
        newOtp[idx] = value;
        return newOtp;
      });
      // Move focus to next input if available
      if (idx < 3 && otpRefs[idx + 1].current) {
        otpRefs[idx + 1].current.focus();
      }
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs[idx - 1].current.focus();
    }
  };

  // OTP Paste Handler (for real-life UX)
  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("Text").replace(/[^0-9]/g, "").slice(0, 4).split("");
    if (pasted.length === 4) {
      setOtp(pasted);
      setTimeout(() => {
        if (otpRefs[3].current) otpRefs[3].current.focus();
      }, 50);
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-center items-center">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="w-full max-w-[1200px] mx-auto min-h-screen flex items-center px-2 py-8">
        {/* LEFT: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center pl-2 md:pl-10">
          {/* Logo Section */}
      <div className="pt-8 pb-4 px-0 border-b border-white/20 flex items-center justify-left ">
        {/* Logo and Name side by side */}
        <img
          src="/images/Screenshot 2025-06-09 172029.png"
          alt="City Center Mall Logo"
          className="w-20 h-20 object-contain mr-1" // Increased size from w-12 h-12 to w-16 h-16
        />
        <div className="flex flex-col items-start justify-center">
          <span className="text-[#2F5383] font-bold text-lg leading-tight">CITY CENTER</span>
          <span className="text-[#2F5383] font-bold text-lg leading-tight">MALL</span>
        </div>
      </div>
          <h2 className="text-4xl font-semibold text-[#222] mb-3">Login</h2>
          <p className="text-[#5b5b5b] text-base mb-7">
            Login to access your admin&nbsp;<span className="font-medium">account</span>
          </p>
          {step === 1 && (
            <form
              className="w-full max-w-[430px] flex flex-col gap-5"
              onSubmit={handleRequestOtp}
              autoComplete="off"
            >
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="mobile">
                  Mobile Number
                </label>
                <input
                  className="w-full border border-[#bcbcbc] rounded-md px-3 py-2 font-medium focus:outline-none focus:border-[#264283] text-base"
                  type="tel"
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  autoComplete="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="Enter your mobile number"
                />
              </div>
              {apiError && (
                <div className="text-red-500 text-sm">{apiError}</div>
              )}
              <button
                type="submit"
                className={`w-full bg-[#264283]  cursor-pointer text-white font-semibold text-lg rounded-md py-2.5 hover:bg-[#1f3662] transition ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}
          {step === 2 && (
            <form
              className="w-full max-w-[430px] flex flex-col gap-5"
              onSubmit={handleVerifyOtp}
              autoComplete="off"
            >
              <div>
                <label className="block text-sm font-medium mb-1 " htmlFor="otp">
                  OTP
                </label>
                <div className="flex gap-4 justify-between w-full max-w-[280px] mx-auto">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      className={`otp-input flex-1 text-3xl md:text-4xl text-center border border-gray-400 rounded-lg p-2 md:p-3 focus:border-[#264283] focus:ring-2 focus:ring-[#26428322] transition bg-white outline-none tracking-widest font-bold`}
                      style={{
                        width: "48px",
                        height: "56px",
                        minWidth: "44px",
                        maxWidth: "64px",
                        letterSpacing: "2px",
                      }}
                      type="text"
                      maxLength={1}
                      value={otp[idx]}
                      onChange={(e) => handleOtpChange(e, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      onPaste={handleOtpPaste}
                      autoFocus={idx === 0}
                      inputMode="numeric"
                      pattern="[0-9]{1}"
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>
              {apiError && (
                <div className="text-red-500 text-sm">{apiError}</div>
              )}
              <button
                type="submit"
                className={`w-full bg-[#264283]  cursor-pointer text-white font-semibold text-lg rounded-md py-2.5 hover:bg-[#1f3662] transition ${loading || otp.some(v => v === "") ? "opacity-60 cursor-not-allowed" : ""}`}
                disabled={loading || otp.some(v => v === "")}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                className="text-[#264283] cursor-pointer underline text-sm"
                onClick={() => {
                  setStep(1);
                  setOtp(["", "", "", ""]);
                  setApiError("");
                }}
              >
                Change mobile number
              </button>
            </form>
          )}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}