// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const pool = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

// Test DB connection
pool.getConnection()
  .then(conn => {
    console.log("✅ MySQL Connected!");
    conn.release();
  })
  .catch(err => {
    console.error("❌ DB Connection Failed:", err);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
