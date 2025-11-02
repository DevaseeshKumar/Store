// models/productModel.js
// This module holds SQL fragments for product operations.
export const ProductFields = [
  "id",
  "name",
  "category",
  "price",
  "description",
  "imageUrl",
  "created_at"
].join(", ");

export const createProductSql = `INSERT INTO products (name, category, price, description, imageUrl) VALUES (?, ?, ?, ?, ?)`;
export const getAllProductsSql = `SELECT ${ProductFields} FROM products ORDER BY id`;
export const getProductByIdSql = `SELECT ${ProductFields} FROM products WHERE id = ?`;
export const updateProductSql = `UPDATE products SET name = ?, category = ?, price = ?, description = ?, imageUrl = ? WHERE id = ?`;
export const deleteProductSql = `DELETE FROM products WHERE id = ?`;
