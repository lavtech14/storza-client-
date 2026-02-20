import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { AxiosError } from "axios";
import { HiEye, HiEyeOff } from "react-icons/hi";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // If user had chosen "remember me", populate email
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await api.post<{ token: string }>("/auth/login", {
        email,
        password,
      });

      login(res.data.token);

      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      navigate("/dashboard");
    } catch (err: unknown) {
      if (isAxiosError<{ message: string }>(err)) {
        setErrorMessage(err.response?.data?.message || "Login failed");
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-all duration-500">
      {/* Glass Card */}
      <div className="w-full max-w-md p-10 rounded-2xl backdrop-blur-xl bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-2xl animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-8 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6"
            >
              <path d="M13 2L3 14h7v8l10-12h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-blue-600">Storza 🚀</h1>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            Smart Retail Management
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 text-sm rounded-lg bg-red-200/70 text-red-700 dark:bg-red-900/50 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Email Field */}
        <div className="relative mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            className="peer w-full px-4 pt-5 pb-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <label
            className="absolute left-4 top-2 text-gray-600 dark:text-gray-300 text-sm transition-all 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
          >
            Email
          </label>
        </div>

        {/* Password Field */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            className="peer w-full px-4 pt-5 pb-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <label
            className="absolute left-4 top-2 text-gray-600 dark:text-gray-300 text-sm transition-all 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
          >
            Password
          </label>

          {/* Eye Toggle */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4 cursor-pointer text-gray-600 dark:text-gray-300"
          >
            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
          </span>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="accent-blue-600"
            />
            Remember me
          </label>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Storza 🚀. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

// Type Guard
function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError)?.isAxiosError === true;
}
