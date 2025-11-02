import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { api } from "../api";
import Sidebar from "../components/Sidebar"; // ✅ Sidebar import
import Footer from "../components/Footer"; // ✅ Footer import

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cart = state?.cart || [];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMode: "Cash on Delivery",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("userId");

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      toast.warn("Please fill all fields!");
      return;
    }

    try {
      const res = await api.post(
        "/orders",
        {
          user_id,
          name: form.name,
          phone: form.phone,
          address: form.address,
          payment_mode: form.paymentMode,
          cart,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order placed successfully!");
      navigate("/bookings", { state: { orderId: res.data.orderId } });
    } catch (err) {
      console.error("Order Error:", err);
      toast.error("Failed to place order");
    }
  };

  if (!cart.length)
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center text-2xl">
          🛒 Your cart is empty
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 
                    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main Checkout Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex-1 flex justify-center items-center px-4"
      >
        <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg">
          <h1 className="text-3xl font-extrabold mb-6 text-center text-yellow-500">
            Checkout
          </h1>

          {/* 🧾 Order Summary */}
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Order Summary
          </h2>
          <ul className="mb-6 border-b pb-4 border-gray-300">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between py-2 text-gray-700">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </li>
            ))}
            <li className="flex justify-between font-bold mt-2 text-gray-900">
              <span>Total</span>
              <span>₹{total}</span>
            </li>
          </ul>

          {/* 📦 Shipping Info */}
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Shipping Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <textarea
              name="address"
              placeholder="Shipping Address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
            />

            {/* 💳 Payment Mode */}
            <div>
              <label className="block mb-2 font-semibold text-gray-800">
                Payment Mode
              </label>
              <select
                name="paymentMode"
                value={form.paymentMode}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-yellow-400 outline-none"
              >
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-all duration-300"
            >
              Confirm Order
            </button>
          </form>
        </div>
      </motion.div>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}
