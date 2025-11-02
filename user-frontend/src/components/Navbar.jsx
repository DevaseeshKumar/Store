import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // ✅ Listen for login/logout changes globally
  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    // Listen for custom events (dispatched manually on login/logout)
    window.addEventListener("loginStatusChanged", handleAuthChange);

    // Also listen for storage changes (in case of multi-tab)
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("loginStatusChanged", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);

    // Notify other components
    window.dispatchEvent(new Event("loginStatusChanged"));
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex justify-between items-center px-6 py-3 
                 bg-gradient-to-r from-blue-600 to-indigo-600 
                 dark:from-gray-900 dark:to-gray-800 
                 text-white shadow-lg sticky top-0 z-50
                 transition-all duration-500 ease-in-out"
    >
      {/* 🛍️ Logo */}
      <Link
        to="/"
        className="text-2xl font-extrabold tracking-wide hover:scale-105 transition-transform"
      >
        StoreEase
      </Link>

      {/* 🔗 Navigation Links */}
      <div className="flex items-center gap-6 text-sm md:text-base font-medium">
        <Link
          to="/"
          className="hover:text-yellow-300 transition-colors duration-300"
        >
          Home
        </Link>

        <Link
          to="/products"
          className="hover:text-yellow-300 transition-colors duration-300"
        >
          Products
        </Link>

        
      </div>
    </motion.nav>
  );
}
