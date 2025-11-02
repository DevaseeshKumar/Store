import express from "express";
import { bookProduct, getBookings } from "../controllers/bookingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/book", verifyToken, bookProduct);
router.get("/", verifyToken, getBookings);

export default router;
