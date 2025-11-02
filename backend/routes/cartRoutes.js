import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/cart/add
router.post("/add", verifyToken, addToCart);

// GET /api/cart
router.get("/", verifyToken, getCart);

// DELETE /api/cart/remove/:productId
router.delete("/remove/:productId", verifyToken, removeFromCart);

export default router;
