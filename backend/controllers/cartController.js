import pool from "../db.js";
import { getCartByUserSql } from "../models/cartModel.js";

// 🧠 Add or update quantity
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId)
      return res.status(400).json({ message: "Product ID required" });

    // Check product exists
    const [productCheck] = await pool.query(
      "SELECT id FROM products WHERE id = ?",
      [productId]
    );
    if (productCheck.length === 0)
      return res.status(404).json({ message: "Product not found" });

    // Check if already in cart
    const [existing] = await pool.query(
      "SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (existing.length > 0) {
      const newQty = existing[0].quantity + quantity;

      // If quantity drops to 0 or less — remove
      if (newQty <= 0) {
        await pool.query(
          "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
          [userId, productId]
        );
        return res.json({ message: "🗑️ Product removed from cart" });
      }

      await pool.query(
        "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
        [newQty, userId, productId]
      );
      return res.json({ message: "✅ Cart updated" });
    }

    // Add new product if not present
    await pool.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [userId, productId, quantity]
    );

    res.status(201).json({ message: "🛒 Added to cart" });
  } catch (err) {
    console.error("AddToCart Error:", err);
    next(err);
  }
};

// 🛒 Fetch all cart items
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(getCartByUserSql, [userId]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const [result] = await pool.query(
      "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Item not found in cart" });

    res.json({ message: "🗑️ Product removed from cart" });
  } catch (err) {
    console.error("RemoveFromCart Error:", err);
    next(err);
  }
};
