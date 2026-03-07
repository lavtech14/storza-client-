import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import storzaImage from "../assets/strozaImage.png";

function HomePage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Navbar */}
      <nav className="w-full border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <h1 className="text-2xl font-bold text-indigo-600">Storza</h1>

          <div className="hidden md:flex items-center gap-8 font-medium">
            <a href="#features" className="hover:text-indigo-600 transition">
              Features
            </a>
            <a href="#pricing" className="hover:text-indigo-600 transition">
              Pricing
            </a>
            <a href="#contact" className="hover:text-indigo-600 transition">
              Contact
            </a>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-indigo-600 transition">
                Resources
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-indigo-600 font-semibold hover:text-indigo-700 transition"
                >
                  Sign In
                </Link>

                <Link
                  to="/login"
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Sign Up Free
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12">
          {/* Text */}
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Run Your Retail Store{" "}
              <span className="text-indigo-600">Faster</span>
              <br />
              with <span className="text-indigo-600">Smart GST Billing</span> &
              Inventory
            </h1>

            <p className="text-slate-600 text-lg mb-8">
              Manage Stock, Generate GST Bills, and Track Sales —<br />
              All in One Powerful Dashboard.
            </p>

            <div className="flex gap-4">
              <Link
                to={token ? "/dashboard" : "/login"}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>

              <button className="px-8 py-3 border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition">
                Watch Demo
              </button>
            </div>

            <div className="flex gap-6 mt-8 text-sm">
              <p className="flex items-center gap-2">
                <span className="text-indigo-600">✓</span> No Credit Card
                Required
              </p>
              <p className="flex items-center gap-2">
                <span className="text-indigo-600">✓</span> Setup in 2 Minutes
              </p>
              <p className="flex items-center gap-2">
                <span className="text-indigo-600">✓</span> GST Compliant
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="hidden md:block">
            <img
              src={storzaImage}
              alt="Storza Dashboard"
              className="w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Storza Section */}
      <section id="features" className="py-16 px-6 bg-slate-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Storza?
        </h2>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">Inventory Management</h3>
            <p className="text-sm text-slate-500 mb-4">500+ Stores</p>
            <p className="text-sm text-slate-600">
              Track real-time stock and manage products easily.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">GST Billing</h3>
            <p className="text-sm text-slate-500 mb-4">Auto Tax Calculation</p>
            <p className="text-sm text-slate-600">
              Automatic CGST/SGST calculation with professional invoices.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">Sales Analytics</h3>
            <p className="text-sm text-slate-500 mb-4">Live Reports</p>
            <p className="text-sm text-slate-600">
              Get insights on sales performance instantly.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">Secure Cloud Backup</h3>
            <p className="text-sm text-slate-500 mb-4">Secure Cloud Backup</p>
            <p className="text-sm text-slate-600">
              Secure cloud storage with 99% uptime.
            </p>
          </div>
        </div>

        {/* Second Row of Features */}
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-6">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">100% Safe</h3>
            <p className="text-sm text-slate-500 mb-4">
              Trusted by Retailers Across India
            </p>
            <p className="text-sm text-slate-600">
              Your data is encrypted and protected.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">Trusted by Retailers</h3>
            <p className="text-sm text-slate-500 mb-4">Across India</p>
            <p className="text-sm text-slate-600">
              Join thousands of satisfied retailers.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">99% Uptime</h3>
            <p className="text-sm text-slate-500 mb-4">GST Compliant</p>
            <p className="text-sm text-slate-600">
              Reliable service you can count on.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition flex items-end">
            <Link
              to="/pricing"
              className="text-indigo-600 font-semibold hover:underline"
            >
              View Pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-slate-500 border-t">
        © {new Date().getFullYear()} Storza — Trusted by Retailers Across India
      </footer>
    </div>
  );
}

export default HomePage;
