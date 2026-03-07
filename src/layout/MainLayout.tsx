import type { ReactNode } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import {
  HiMoon,
  HiSun,
  HiLogout,
  HiHome,
  HiCube,
  HiReceiptTax,
  HiClipboardList,
} from "react-icons/hi";

interface SidebarLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
}

function SidebarLink({ to, icon, label }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`
      }
    >
      {icon} {label}
    </NavLink>
  );
}

function MainLayout({ children }: { children: ReactNode }) {
  const { darkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col p-6">
        {/* Top: Brand + Dark Mode Toggle */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="mb-4">
            <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
              Storza 🚀
            </h2>
          </Link>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? <HiSun className="text-yellow-400" /> : <HiMoon />}
            <span className="sr-only">Toggle Theme</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          <SidebarLink to="/dashboard" icon={<HiHome />} label="Dashboard" />
          <SidebarLink to="/products" icon={<HiCube />} label="Products" />
          <SidebarLink to="/sales" icon={<HiReceiptTax />} label="Sales" />
          <SidebarLink
            to="/sales-history"
            icon={<HiClipboardList />}
            label="Sales History"
          />
          <SidebarLink to="/purchases" icon={<HiHome />} label="Purchases" />
          <SidebarLink
            to="/purchases-history"
            icon={<HiHome />}
            label="Purchases History"
          />
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          <HiLogout /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Page Content */}
        <div className="flex-1 p-0 text-gray-900 dark:text-gray-100">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
