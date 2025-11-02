import db from "../db.js";
import {
  insertOrderSql,
  insertOrderItemsSql,
  getOrdersByUserSql,
} from "../models/orderModel.js";

// 🧠 Place a new order
export const placeOrder = async (req, res) => {
  const { name, phone, address, cart, payment_mode } = req.body;
  const userId = req.user.id; // ✅ from verifyToken middleware

  if (!name || !phone || !address || !cart?.length) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // 🧾 Insert into orders table
    const [orderResult] = await db.query(insertOrderSql, [
      userId,
      name,
      phone,
      address,
      payment_mode || "Cash on Delivery", // ✅ Default if not provided
      "Pending", // ✅ Default order status
    ]);

    const orderId = orderResult.insertId;

    // 🛍️ Prepare order items data
    const values = cart.map((item) => [
      orderId,
      item.id || item.productId,
      item.quantity,
      item.price,
    ]);

    // ✅ Insert order items
    await db.query(insertOrderItemsSql, [values]);

    res.status(201).json({
      message: "✅ Order placed successfully!",
      orderId,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🧾 Fetch all orders of the logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(getOrdersByUserSql, [userId]);

    if (rows.length === 0) {
      return res.status(200).json([]);
    }

    // 📦 Group items by order ID
    const ordersMap = new Map();

    rows.forEach((r) => {
      if (!ordersMap.has(r.order_id)) {
        ordersMap.set(r.order_id, {
          order_id: r.order_id,
          customer_name: r.customer_name,
          phone: r.phone,
          address: r.address,
          payment_mode: r.payment_mode,
          status: r.status, // ✅ added
          created_at: r.created_at,
          estimated_delivery: r.estimated_delivery, // ✅ added
          items: [],
          total: 0,
        });
      }

      const order = ordersMap.get(r.order_id);
      order.items.push({
        product_id: r.product_id,
        name: r.product_name,
        quantity: r.quantity,
        price: r.price,
      });

      order.total += r.price * r.quantity;
    });

    res.json(Array.from(ordersMap.values()));
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


// ✅ Admin: Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ message: "Order ID and status are required" });
    }

    const [result] = await db.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: `✅ Order #${orderId} updated to '${status}' successfully.` });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};
export const getAllOrders = async (req, res) => {
  const [rows] = await db.query(`
    SELECT o.id AS order_id, o.customer_name, o.phone, o.address, o.payment_mode,
           o.status, o.created_at, oi.product_id, p.name AS product_name, 
           oi.quantity, oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    ORDER BY o.created_at DESC
  `);

  const ordersMap = new Map();
  rows.forEach((r) => {
    if (!ordersMap.has(r.order_id)) {
      ordersMap.set(r.order_id, {
        order_id: r.order_id,
        customer_name: r.customer_name,
        phone: r.phone,
        address: r.address,
        payment_mode: r.payment_mode,
        status: r.status,
        created_at: r.created_at,
        items: [],
        total: 0,
      });
    }

    const order = ordersMap.get(r.order_id);
    order.items.push({
      product_id: r.product_id,
      name: r.product_name,
      quantity: r.quantity,
      price: r.price,
    });
    order.total += r.price * r.quantity;
  });

  res.json(Array.from(ordersMap.values()));
};
