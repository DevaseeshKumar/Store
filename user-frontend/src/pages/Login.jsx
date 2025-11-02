import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful!");
      navigate("/products");
    } catch (err) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white">
      {/* ✅ Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center flex-1 text-center px-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 w-full max-w-md"
        >
          <h1 className="text-4xl font-extrabold text-yellow-300 mb-6 drop-shadow-lg">
            Welcome Back
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 
                         placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-yellow-300"
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 
                         placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-yellow-300"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-yellow-300 text-gray-900 py-3 font-semibold 
                         rounded-lg shadow-lg hover:bg-yellow-200 transition-all 
                         duration-300 hover:shadow-2xl transform hover:-translate-y-1"
            >
              Login
            </motion.button>
          </form>

          <p className="mt-6 text-white/90 text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-yellow-300 font-semibold hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
