// controllers/userController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import {
  createUserSql,
  getUserByEmailSql,
  getUserByIdSql,
} from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Check if user already exists
    const [existing] = await pool.query(getUserByEmailSql, [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.query(createUserSql, [
      name,
      email,
      hashedPassword,
    ]);
    const userId = result.insertId;

    // Create JWT token
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: userId, name, email },
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const [user] = await pool.query(getUserByEmailSql, [email]);
    if (user.length === 0)
      return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user[0].id, email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user[0].id, name: user[0].name, email: user[0].email },
    });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(getUserByIdSql, [userId]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};
