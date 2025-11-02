// src/pages/Products.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const categories = [
    "All",
    "Stationery",
    "Grocery",
    "Electronics",
    "Clothing",
    "Accessories",
  ];

  useEffect(() => {
    api
      .get("/view-products")
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Failed to load products"));
  }, []);

  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Please login to add to cart");
      navigate("/login");
      return;
    }

    try {
      await api.post(
        "/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" ||
      p.category?.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main content */}
      <div className="flex-1 ml-56 p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10"
        >
          <h1 className="text-3xl font-extrabold tracking-wide">
            Explore Our Products
          </h1>

          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none rounded-lg px-4 py-2 
                       w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-yellow-400 
                       bg-white/20 text-white placeholder-white/70
                       backdrop-blur-md transition-all duration-300"
          />
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 
                          text-sm shadow-md backdrop-blur-md ${
                activeCategory === cat
                  ? "bg-yellow-400 text-gray-900 scale-105 shadow-yellow-500/30"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center"
        >
          {filteredProducts.length ? (
            filteredProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg 
                           hover:shadow-2xl transition-all duration-300 
                           overflow-hidden w-full max-w-xs border border-white/20"
              >
                <img
                  src={p.imageUrl || "https://via.placeholder.com/250"}
                  alt={p.name}
                  className="h-52 w-full object-cover rounded-t-2xl"
                />

                <div className="p-5 text-center">
                  <h2 className="text-lg font-bold mb-1">{p.name}</h2>
                  <p className="text-white/80 text-sm">{p.category}</p>
                  <p className="text-yellow-300 font-semibold mt-2 text-lg">
                    ₹{p.price}
                  </p>

                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      onClick={() => addToCart(p.id)}
                      className="bg-yellow-400 text-gray-900 py-2 rounded-lg 
                                 font-semibold hover:bg-yellow-300 transition-all"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() => navigate(`/product/${p.id}`)}
                      className="bg-white/20 text-white py-2 rounded-lg 
                                 hover:bg-white/30 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-white/80 text-center text-lg mt-10">
              No products found.
            </p>
          )}
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
