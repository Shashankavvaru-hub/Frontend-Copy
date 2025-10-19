import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { showSuccessToast, showErrorToast } from "../utils/notifications";
import { Mail, Lock, ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetOtp = async (e) => {
    e.preventDefault(); // This prevents page reload
    const setLoadingState = showOtpInput ? setResendLoading : setLoading; // CHANGED
    setLoadingState(true);
    try {
      await axios.post("http://localhost:8080/api/auth/login", { email });
      setShowOtpInput(true);
      if (showOtpInput) {
        showSuccessToast("A new OTP has been sent."); // CHANGED
      } else {
        showSuccessToast("OTP has been sent to your email.");
      }
    } catch (err) {
      showErrorToast(
        err.response?.data || "Failed to send OTP. Please check the email."
      );
      console.error(err);
    } finally {
      setLoadingState(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); // This prevents page reload
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/verify-otp",
        { email, otp }
      );
      login(response.data.token);
      console.log("Verify OTP response:", response.data);

      if (response.data.newUser) {
        navigate("/complete-profile");
      } else {
        navigate("/");
      }
    } catch (err) {
      showErrorToast(err.response?.data || "Invalid OTP. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 border-4 border-orange-800 rotate-45 transform -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-indigo-800 rotate-12 transform translate-x-48 translate-y-48"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 border-4 border-amber-700 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <Sparkles className="w-10 h-10 text-amber-100" />
          </div> */}
          <h1 className="text-4xl font-bold text-gray-800 mb-2 font-playfair">
            Kalaa Setu
          </h1>
          <p className="text-gray-600">Welcome back to the Art Bridge</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-4 border-orange-600">
          <div className="h-2 bg-gradient-to-r from-orange-600 via-amber-500 to-indigo-700"></div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {showOtpInput ? "Verify Your Identity" : "Sign In"}
            </h2>

            {!showOtpInput ? (
              // CHANGED: Wrapped in <form> with onSubmit
              <form onSubmit={handleGetOtp} className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail
                        className={`w-5 h-5 transition-colors ${
                          focusedInput === "email"
                            ? "text-orange-600"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="artist@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput("")}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* CHANGED: type="submit" instead of onClick */}
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Get OTP
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              // CHANGED: Wrapped in <form> with onSubmit
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      OTP Sent Successfully
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Check your inbox at{" "}
                      <span className="font-semibold">{email}</span>
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter 6-Digit OTP
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock
                        className={`w-5 h-5 transition-colors ${
                          focusedInput === "otp"
                            ? "text-orange-600"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      onFocus={() => setFocusedInput("otp")}
                      onBlur={() => setFocusedInput("")}
                      required
                      maxLength={6}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 text-center text-2xl tracking-widest font-semibold"
                    />
                    <div className="text-right mt-2">
                      <button
                        type="button"
                        disabled={resendLoading}
                        onClick={handleGetOtp}
                        className="text-sm font-medium text-kalaa-orange hover:text-kalaa-indigo transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resendLoading ? "Sending..." : "Resend OTP"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* CHANGED: type="submit" instead of onClick */}
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Verify & Login
                    </>
                  )}
                </button>

                {/* CHANGED: type="button" to prevent form submission */}
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpInput(false);
                    setOtp("");
                  }}
                  className="w-full text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors"
                >
                  ← Use different email
                </button>
              </form>
            )}

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  New to Kalaa Setu?
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/register"
                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors inline-flex items-center gap-1 group"
              >
                Create an account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Secure Login</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-orange-600" />
            <span>OTP Protected</span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          By continuing, you agree to Kalaa Setu's Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
