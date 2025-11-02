// routes/productRoutes.js
import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

router.get("/view-products", getProducts);          // GET /api/products
router.get("/view-product/:id", getProduct);        // GET /api/products/:id
router.post("/add-product", createProduct);       // POST /api/products
router.put("/edit-product/:id", updateProduct);     // PUT /api/products/:id
router.delete("/delete-product/:id", deleteProduct);  // DELETE /api/products/:id

export default router;
