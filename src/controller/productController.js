const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const db = new sqlite3.Database("./db.sqlite");

// Create a product with image upload

// Create a product with image upload
// ... (other code)

// Create a product with base64-encoded image
exports.createProduct = (req, res) => {
  const { name, price, description, image } = req.body;

  console.log("Received Image Data:", req.body); // Add this line to check the image data

  try {
    // Decode the base64 image data
    // const imageBuffer = Buffer.from(image, "base64");

    db.run(
      "INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)",
      [name, price, description, image],
      function (err) {
        if (err) {
          console.error("Error creating product:", err.message);
          return res.status(500).json({ error: "Failed to create product." });
        }

        res.json({ id: this.lastID });
      }
    );
  } catch (error) {
    console.error("Error in createProduct controller:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Read all products
exports.getAllProducts = (req, res) => {
  try {
    db.all("SELECT * FROM products", (err, rows) => {
      if (err) {
        console.error("Error fetching products:", err.message);
        return res.status(500).json({ error: "Failed to fetch products." });
      }

      res.json(rows);
    });
  } catch (error) {
    console.error("Error in getAllProducts controller:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Read a single product with image retrieval as base64
exports.getProductById = (req, res) => {
  const productId = req.params.id;

  try {
    db.get("SELECT * FROM products WHERE id = ?", [productId], (err, row) => {
      if (err) {
        console.error("Error fetching product:", err.message);
        return res.status(500).json({ error: "Failed to fetch product." });
      }

      if (!row) {
        return res.status(404).json({ error: "Product not found." });
      }

      // Create the productWithImage object and include other properties from 'row'
      const productWithImage = {
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        // Set the 'image' property to null if it is not available
        image:
          row.image && Buffer.isBuffer(row.image)
            ? row.image.toString("base64")
            : null,
        // Include other properties from 'row'
        // Add more properties as needed
      };

      res.json(productWithImage);
    });
  } catch (error) {
    console.error("Error in getProductById controller:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Update a product
exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  const { name, price, description } = req.body;

  try {
    db.run(
      "UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?",
      [name, price, description, productId],
      (err) => {
        if (err) {
          console.error("Error updating product:", err.message);
          return res.status(500).json({ error: "Failed to update product." });
        }

        res.json({ message: "Product updated successfully." });
      }
    );
  } catch (error) {
    console.error("Error in updateProduct controller:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Delete a product
exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  try {
    db.run("DELETE FROM products WHERE id = ?", [productId], (err) => {
      if (err) {
        console.error("Error deleting product:", err.message);
        return res.status(500).json({ error: "Failed to delete product." });
      }

      res.json({ message: "Product deleted successfully." });
    });
  } catch (error) {
    console.error("Error in deleteProduct controller:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};
