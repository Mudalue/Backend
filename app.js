const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const productRoutes = require("./src/routes/productRoutes");
const sqlite3 = require("sqlite3").verbose();

app.use(cors());
//built in middle ware to handle form data
app.use(express.urlencoded({ extended: false }));
//built in middle ware for json
// app.use(express.json());
// Middleware to parse incoming request bodies
app.use(bodyParser.json());

// Create and connect to the database


const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the database.');

    // Create the "products" table with the necessary columns
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        description TEXT,
        image TEXT
      );
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Table "products" created/checked successfully.');
      }
    });
  }
});


// Use the product routes
app.use("/api", productRoutes);

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
