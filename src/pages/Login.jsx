import React, { useState } from "react";
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
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

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
        toast.success("OTP sent successfully!");
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
    try {
      const res = await axios.get(
        `https://api.citycentermall.com/api/v1/auth/verify-otp`,
        {
          params: { mobile_no: mobile.replace(/[,\s]/g, ""), otp }
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

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-center items-center">
      <ToastContainer position="top-center" autoClose={3000} />
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
                <label className="block text-sm font-medium mb-1" htmlFor="otp">
                  OTP
                </label>
                <input
                  className="w-full border border-[#bcbcbc] rounded-md px-3 py-2 font-medium focus:outline-none focus:border-[#264283] text-base"
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoComplete="one-time-code"
                  required
                  pattern="[0-9]{4,6}"
                  placeholder="Enter OTP"
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
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                className="text-[#264283] cursor-pointer underline text-sm"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setApiError("");
                }}
              >
                Change mobile number
              </button>
            </form>
          )}
          {/* <div className="text-center text-sm mt-5">
            <span className="text-[#222]">Don’t have an account? </span>
            <a href="/signup" className="text-[#FF3B3B] font-medium hover:underline">Sign up</a>
          </div> */}
          {/* <div className="flex items-center my-3">
            <div className="flex-1 h-px bg-[#e2e2e2]" />
            <span className="mx-2 text-xs text-[#888]">Or login with</span>
            <div className="flex-1 h-px bg-[#e2e2e2]" />
          </div> */}
          {/* <div className="grid grid-cols-3 gap-4">
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
          </div> */}
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
                {/* <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                  <span className="h-[6px] w-[18px] rounded-lg bg-[#757CFF]" />
                  <span className="h-[6px] w-[6px] rounded-full bg-[#D1D5DB]" />
                  <span className="h-[6px] w-[6px] rounded-full bg-[#D1D5DB]" />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}