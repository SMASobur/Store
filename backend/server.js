import express from "express";
import dotenv from "dotenv";
import path from "path";

import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.route.js";
import bookRoutes from "./routes/book.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body

app.use("/api/products", productRoutes);
app.use("/api/books", bookRoutes);

if (process.env.NODE_ENV === "production") {
  // Serve static files from frontend/dist
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  // Handle SPA routing (serve index.html for all unmatched routes)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

app
  .listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use.`);
    }
  });
