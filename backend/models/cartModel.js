// models/cartModel.js
export const addToCartSql = `
  INSERT INTO cart (user_id, product_id, quantity)
  VALUES (?, ?, ?)
  ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
`;

export const getCartByUserSql = `
  SELECT 
    c.id AS cartId,
    c.product_id AS productId,
    p.name,
    p.price,
    c.quantity,
    p.imageUrl
  FROM cart c
  JOIN products p ON c.product_id = p.id
  WHERE c.user_id = ?
`;


export const removeFromCartSql = `
  DELETE FROM cart WHERE user_id = ? AND product_id = ?
`;
