// src/components/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ShoppingCart, User, Package, LogOut } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const links = [
    { to: "/", icon: <Home size={20} />, label: "Home" },
    { to: "/products", icon: <Package size={20} />, label: "Products" },
    { to: "/cart", icon: <ShoppingCart size={20} />, label: "Cart" },
    { to: "/bookings", icon: <Package size={20} />, label: "Orders" },
    { to: "/profile", icon: <User size={20} />, label: "Profile" },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 h-full w-56 bg-gradient-to-b 
                 from-blue-700 via-indigo-700 to-purple-700 
                 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
                 text-white shadow-xl flex flex-col justify-between p-5"
    >
      {/* 🔹 Logo */}
      <div>
        <h1 className="text-2xl font-extrabold mb-10 tracking-wide text-center">
          StoreEase
        </h1>

        {/* 🔹 Nav Links */}
        <nav className="space-y-3">
          {links.map(({ to, icon, label }) => (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all
                ${
                  location.pathname === to
                    ? "bg-yellow-400 text-gray-900 shadow-md"
                    : "hover:bg-white/20"
                }`}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* 🔹 Logout or Login */}
      <div className="mt-8 border-t border-white/20 pt-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg w-full 
                       bg-white/20 hover:bg-white/30 transition-all text-left"
          >
            <LogOut size={20} /> Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 px-4 py-2 rounded-lg w-full 
                       bg-green-500 hover:bg-green-600 transition-all text-left"
          >
            <User size={20} /> Login
          </button>
        )}
      </div>
    </motion.aside>
  );
}
