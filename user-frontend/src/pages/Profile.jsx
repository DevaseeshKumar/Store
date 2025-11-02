import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to view your profile");
      navigate("/login");
      return;
    }

    api
      .get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Profile fetch error:", err);
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          toast.error("Failed to fetch user details");
        }
      });
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white">
        <p className="text-lg animate-pulse">Loading profile...</p>
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
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-6 text-center">
            User Profile
          </h2>

          <div className="space-y-4 text-white/90">
            <p className="text-lg">
              <span className="font-semibold text-white">Name:</span>{" "}
              {user.name}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-white">Email:</span>{" "}
              {user.email}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-white">Role:</span>{" "}
              {user.role || "Customer"}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-white">Joined On:</span>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* ✅ Footer */}
        <Footer />
      </div>
    </div>
  );
}
