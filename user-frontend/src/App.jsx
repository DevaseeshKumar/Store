import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Bookings from "./pages/Bookings";
import Checkout from "./pages/Checkout";


import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* Navbar */}
        <Navbar />

        {/* Animated Pages */}
        {/* <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="p-6 container mx-auto"
        > */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/profile" element={<Profile />} />
          </Routes>
        {/* </motion.div> */}
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}
