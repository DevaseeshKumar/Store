// routes/orderRoutes.js
import express from "express";
import { placeOrder, getUserOrders, updateOrderStatus,getAllOrders} from "../controllers/orderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/orders
router.post("/", verifyToken, placeOrder);
router.get("/my", verifyToken, getUserOrders); // ✅ new route


router.put("/:orderId/status", updateOrderStatus);
router.get("/all", getAllOrders); // Fetch all orders for admin
export default router;
