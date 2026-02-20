import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function HomePage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-all duration-500">
      {/* 🔥 Transparent Glass Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 dark:bg-black/10 backdrop-blur-lg border-b border-white/20 dark:border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
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
            <h1 className="text-2xl font-bold text-white">Storza 🚀</h1>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            {!token ? (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            ) : (
              <>
                <Link to="/dashboard" className="btn-primary">
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn-primary bg-red-500 hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="text-center pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto rounded-2xl backdrop-blur-xl bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-2xl p-10">
          <h1 className="text-6xl font-extrabold mb-6 text-gray-900 dark:text-white">
            Storza 🚀
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-400 mb-8">
            Smart Retail Management for Modern Indian Stores. Manage inventory,
            GST billing, and sales analytics — all in one powerful platform.
          </p>
          <Link
            to={token ? "/dashboard" : "/login"}
            className="btn-primary px-10 py-4 text-lg"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="pb-24 px-6">
        <h2 className="text-3xl font-bold text-center mb-14 text-gray-900 dark:text-white">
          Why Choose Storza?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              title: "📦 Inventory Management",
              desc: "Track stock, manage products and get real-time low stock alerts.",
            },
            {
              title: "🧾 GST Billing",
              desc: "Automatic CGST/SGST calculation with professional billing flow.",
            },
            {
              title: "📊 Sales Analytics",
              desc: "Monitor revenue, payment modes and performance instantly.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl backdrop-blur-xl bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-700 dark:text-gray-400">
        © {new Date().getFullYear()} Storza 🚀. All rights reserved.
      </footer>
    </div>
  );
}

export default HomePage;
