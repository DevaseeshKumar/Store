import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 
                 dark:from-gray-900 dark:to-gray-800 
                 text-white py-6 px-8 mt-10 shadow-inner
                 transition-all duration-500 ease-in-out"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* 🌐 Brand */}
        <div className="text-center md:text-left">
          <h1 className="text-xl font-bold">StoreEase</h1>
          <p className="text-sm text-gray-200 mt-1">
            Simplifying your shopping experience.
          </p>
        </div>

        {/* 🔗 Quick Links */}
        <div className="flex gap-6 text-sm md:text-base">
          
          <Link
            to="/bookings"
            className="hover:text-yellow-300 transition-colors duration-300"
          >
            My Orders
          </Link>
          <Link
            to="/contact"
            className="hover:text-yellow-300 transition-colors duration-300"
          >
            Contact
          </Link>
        </div>

        
      </div>

      {/* ©️ Bottom Note */}
      <div className="text-center text-xs text-gray-300 mt-4 border-t border-white/20 pt-3">
        © {new Date().getFullYear()} StoreEase. All rights reserved.
      </div>
    </motion.footer>
  );
}
