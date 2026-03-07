import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { AxiosError } from "axios";
import { HiEye, HiEyeOff } from "react-icons/hi";

// Define the expected response type
interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
    isAdmin?: boolean;
    // Add any other user fields your API returns
  };
}

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

      // Update the type here to expect user data
      const res = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      console.log("Login response:", res.data); // Debug log

      // Check if user data is present in the response
      if (res.data.user) {
        // Pass both token and user data to login function
        login(res.data.token, res.data.user);
      } else {
        // If your API doesn't return user data, you might need to fetch user profile separately
        // Option 1: Just pass token and handle user fetch in AuthProvider
        login(res.data.token);

        // Option 2: Fetch user profile after login
        try {
          const userRes = await api.get("/auth/profile");
          login(res.data.token, userRes.data);
        } catch (profileErr) {
          console.error("Failed to fetch user profile:", profileErr);
        }
      }

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
    <div className="min-h-screen flex items-center justify-center bg-white text-slate-800">
      {/* Card */}
      <div className="w-full max-w-md p-10 rounded-2xl bg-white border border-slate-200 shadow-xl">
        {/* Logo */}
        <div className="text-center mb-8 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6"
            >
              <path d="M13 2L3 14h7v8l10-12h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-indigo-600">Storza</h1>
          <p className="text-sm text-slate-600 mt-1">Smart Retail Management</p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 text-sm rounded-lg bg-red-100 text-red-700 border border-red-200">
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
            className="peer w-full px-4 pt-5 pb-2 rounded-lg bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <label
            className="absolute left-4 top-2 text-slate-600 text-sm transition-all 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600"
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
            className="peer w-full px-4 pt-5 pb-2 rounded-lg bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <label
            className="absolute left-4 top-2 text-slate-600 text-sm transition-all 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600"
          >
            Password
          </label>

          {/* Eye Toggle */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4 cursor-pointer text-slate-600 hover:text-indigo-600 transition"
          >
            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
          </span>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <label className="flex items-center gap-2 text-slate-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="accent-indigo-600"
            />
            Remember me
          </label>
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-700 hover:underline transition"
          >
            Forgot password?
          </a>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition"
          >
            Sign up free
          </a>
        </p>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Storza — Trusted by Retailers Across
          India
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
