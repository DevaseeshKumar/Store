import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api
      .get(`/view-product/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error("Failed to load product details"));
  }, [id]);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white">
        <p className="text-lg animate-pulse">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main Content */}
      <div className="flex-1 ml-56 p-8 text-white">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8">
          <img
            src={product.imageUrl || "https://via.placeholder.com/400"}
            alt={product.name}
            className="w-full h-80 object-cover rounded-xl mb-6 shadow-lg"
          />

          <h2 className="text-3xl font-extrabold text-white mb-3">
            {product.name}
          </h2>
          <p className="text-white/90 mb-4 leading-relaxed">
            {product.description}
          </p>

          <p className="text-yellow-300 font-bold text-2xl mb-2">
            ₹{product.price}
          </p>
          <p className="text-white/80 mb-6">
            Category: <span className="font-semibold">{product.category}</span>
          </p>

          {/* ✅ Back Button */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="bg-yellow-300 text-gray-900 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-200 transition-all shadow-md"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* ✅ Footer */}
        <Footer />
      </div>
    </div>
  );
}
