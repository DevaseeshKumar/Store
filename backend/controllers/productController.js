// controllers/productController.js
import pool from "../db.js";
import {
  createProductSql,
  getAllProductsSql,
  getProductByIdSql,
  updateProductSql,
  deleteProductSql
} from "../models/productModel.js";

export const getProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.query(getAllProductsSql);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query(getProductByIdSql, [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, category, price, description = "", imageUrl = "" } = req.body;
    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: "name, category and price are required" });
    }
    const [result] = await pool.query(createProductSql, [name, category, price, description, imageUrl]);
    const insertedId = result.insertId;
    const [rows] = await pool.query(getProductByIdSql, [insertedId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, category, price, description = "", imageUrl = "" } = req.body;
    // optional: check presence of product
    const [check] = await pool.query(getProductByIdSql, [id]);
    if (check.length === 0) return res.status(404).json({ message: "Product not found" });

    await pool.query(updateProductSql, [name ?? check[0].name, category ?? check[0].category, price ?? check[0].price, description, imageUrl, id]);
    const [rows] = await pool.query(getProductByIdSql, [id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [check] = await pool.query(getProductByIdSql, [id]);
    if (check.length === 0) return res.status(404).json({ message: "Product not found" });

    await pool.query(deleteProductSql, [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};
