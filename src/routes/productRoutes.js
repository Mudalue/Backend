const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

// Create a product
router.post("/products", productController.createProduct);

// Read all products
router.get("/products", productController.getAllProducts);

// Read a single product
router.get("/products/:id", productController.getProductById);

// Update a product
router.put("/products/:id", productController.updateProduct);

// Delete a product
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
