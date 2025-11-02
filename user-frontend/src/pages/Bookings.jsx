import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Bookings() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRange, setFilterRange] = useState("all");
  const navigate = useNavigate();

  // ✅ Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
        setFilteredOrders(res.data);
      } catch (err) {
        console.error("Fetch orders error:", err);
        toast.error("Failed to fetch your orders");
      }
    };
    fetchOrders();
  }, []);

  // ✅ Filter logic
  useEffect(() => {
    let filtered = [...orders];

    // 🔍 Search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (o) =>
          o.order_id.toString().includes(searchTerm) ||
          o.items?.some((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    //  Date range filter
    const now = new Date();
    filtered = filtered.filter((order) => {
      const orderDate = new Date(order.created_at);
      if (filterRange === "week") {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        return orderDate >= lastWeek;
      }
      if (filterRange === "month") {
        const lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - 1);
        return orderDate >= lastMonth;
      }
      if (filterRange === "3months") {
        const last3Months = new Date();
        last3Months.setMonth(now.getMonth() - 3);
        return orderDate >= last3Months;
      }
      return true;
    });

    setFilteredOrders(filtered);
  }, [searchTerm, filterRange, orders]);

  if (!orders.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white flex-col gap-4">
        <p className="text-lg">📦 You have no orders yet</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-white text-yellow-600 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-100 transition-all"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Sidebar />

      <div className="flex-1 ml-56 p-8 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold text-center mb-10"
        >
          My Orders
        </motion.h1>

        {/* ✅ Search + Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="🔍 Search by Order ID or Product Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />

          <select
  value={filterRange}
  onChange={(e) => setFilterRange(e.target.value)}
  className="px-4 py-2 rounded-lg border border-white/30 
             bg-white text-gray-900 font-semibold
             focus:outline-none focus:ring-2 focus:ring-yellow-400"
>
  <option value="all">All Orders</option>
  <option value="week">Last Week</option>
  <option value="month">Last Month</option>
  <option value="3months">Last 3 Months</option>
</select>

        </div>

        <motion.div
          layout
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20"
        >
          <div className="flex justify-end mb-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-yellow-300 text-gray-900 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-200 transition-all shadow-md"
            >
              Back
            </button>
          </div>

          {/* ✅ Orders List */}
          <div className="space-y-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <motion.div
                  key={order.order_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/10 rounded-xl p-5 border border-white/20 shadow-md hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <h2 className="font-bold text-lg">
                      Order #{order.order_id}
                    </h2>
                    <span
                      className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === "Delivered"
                          ? "bg-green-200 text-green-800"
                          : order.status === "Shipped"
                          ? "bg-blue-200 text-blue-800"
                          : order.status === "Processing"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-white/90 space-y-1 mb-4">
                    <p><strong>Customer:</strong> {order.customer_name}</p>
                    <p><strong>Phone:</strong> {order.phone}</p>
                    <p><strong>Address:</strong> {order.address}</p>
                    <p><strong>Payment Mode:</strong> {order.payment_mode}</p>
                    <p>
                      <strong>Booking Time:</strong>{" "}
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                    <p>
                      <strong>Estimated Delivery:</strong>{" "}
                      {new Date(order.estimated_delivery).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="border-t border-white/20 pt-3">
                    <h3 className="font-medium mb-2">Items:</h3>
                    <ul className="space-y-1">
                      {order.items?.map((item, i) => (
                        <li
                          key={i}
                          className="flex justify-between text-white/90"
                        >
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span>₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex justify-between font-bold mt-3 text-yellow-300">
                      <span>Total:</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-white/80">
                No orders found for this filter.
              </p>
            )}
          </div>
        </motion.div>

        <Footer />
      </div>
    </div>
  );
}
