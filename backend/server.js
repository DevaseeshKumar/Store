// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// ✅ Secure CORS setup
const allowedOrigins = [
  "http://localhost:5173", // React dev server
  "https://your-frontend-domain.com", // Add your production domain here
  "http://localhost:5174" // Add your development domain here
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman) or whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked CORS request from:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // optional, only if using cookies or sessions
  })
);

app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => res.send("Stationery Store API is running 🚀"));

// ✅ API routes
app.use("/api", productRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
