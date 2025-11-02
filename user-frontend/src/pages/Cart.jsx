import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);

  // ✅ Fetch cart
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const cleaned = res.data.map((item) => ({
        ...item,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      }));
      setCart(cleaned);
    } catch (err) {
      console.error("Fetch cart error:", err);
      toast.error("Failed to load cart");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.info("Please login to access your cart");
      navigate("/login");
      return;
    }
    fetchCart();
  }, [token, navigate]);

  // ✅ Remove item
  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item removed");
      fetchCart();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  // ✅ Update quantity
  const updateQuantity = async (productId, change) => {
    try {
      await api.post(
        "/cart/add",
        { productId, quantity: change },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  // ✅ Checkout
  const handlePlaceOrder = () => {
    if (!cart.length) return toast.error("🛒 Your cart is empty!");
    navigate("/checkout", { state: { cart } });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ✅ Filtered cart based on search
  const filteredCart = cart.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!cart.length)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white flex-col gap-4">
        <p className="text-lg">🛒 Your cart is empty</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-all"
        >
          Browse Products
        </button>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Sidebar />

      <div className="flex-1 ml-56 p-8 text-white">
        {/* ✅ Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold text-center mb-10"
        >
          Your Cart
        </motion.h1>

        {/* ✅ Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="🔍 Search items in your cart..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg px-4 py-2 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
          />
        </div>

        {/* ✅ Cart Items */}
        <motion.div
          layout
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20"
        >
          <div className="flex flex-col gap-6">
            {filteredCart.length > 0 ? (
              filteredCart.map((item, i) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white/10 rounded-xl p-4 shadow-md hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  <div className="flex items-center gap-5">
                    <img
                      src={item.imageUrl || "https://via.placeholder.com/80"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl shadow-md border border-white/20"
                    />
                    <div>
                      <h2 className="font-bold text-lg">{item.name}</h2>
                      <p className="text-white/80 text-sm">
                        {formatCurrency(item.price)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition-all"
                        >
                          −
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end mt-4 sm:mt-0">
                    <p className="font-semibold text-yellow-300 text-lg">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="bg-red-500/80 hover:bg-red-600 px-4 py-2 mt-2 rounded-lg font-medium transition-all shadow-md"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-white/80">
                No items match your search.
              </p>
            )}
          </div>

          {/* ✅ Total + Checkout */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-6">
            <h3 className="text-xl font-bold">
              Total:{" "}
              <span className="text-yellow-300 text-2xl">
                {formatCurrency(total)}
              </span>
            </h3>

            <button
              onClick={handlePlaceOrder}
              className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold 
                         hover:bg-yellow-300 transition-all shadow-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </motion.div>

        <Footer />
      </div>
    </div>
  );
}
