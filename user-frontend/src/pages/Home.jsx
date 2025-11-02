import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white">
      {/* ✅ Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center flex-1 text-center px-6"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-5xl sm:text-6xl font-extrabold mb-6 drop-shadow-lg"
        >
          Welcome to{" "}
          <span className="text-yellow-300">Our Online Store</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-lg sm:text-xl text-white/90 max-w-2xl mb-10 leading-relaxed"
        >
          Discover amazing products — from everyday essentials to exclusive
          deals. Enjoy quality, comfort, and convenience all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link
            to="/products"
            className="px-8 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-xl 
                       shadow-lg hover:bg-yellow-200 transition-all duration-300
                       hover:shadow-2xl transform hover:-translate-y-1"
          >
            Start Shopping
          </Link>
        </motion.div>
      </motion.div>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}
