// 🧾 Insert a new order
export const insertOrderSql = `
  INSERT INTO orders (
    user_id,
    customer_name,
    phone,
    address,
    payment_mode,
    status,
    booking_time,
    estimated_delivery
  )
  VALUES (?, ?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY))
`;

// 🛍️ Insert order items
export const insertOrderItemsSql = `
  INSERT INTO order_items (order_id, product_id, quantity, price)
  VALUES ?
`;

export const getOrdersByUserSql = `
  SELECT 
    o.id AS order_id,
    o.customer_name,
    o.phone,
    o.address,
    o.payment_mode,
    o.status,
    o.booking_time AS created_at,
    o.estimated_delivery,
    oi.product_id,
    p.name AS product_name,
    oi.quantity,
    oi.price
  FROM orders o
  JOIN order_items oi ON o.id = oi.order_id
  JOIN products p ON oi.product_id = p.id
  WHERE o.user_id = ?
  ORDER BY o.booking_time DESC;
`;
