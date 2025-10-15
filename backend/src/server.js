// =============================
// 🔹 Import dependencies
// =============================
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

// 🔹 Import file internal
// (pastikan posisi ini setelah import package eksternal)
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import db from "./config/db.js"; // koneksi database

// =============================
// 🔹 Inisialisasi dan konfigurasi
// =============================
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware keamanan & parsing
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5050"], // nanti frontend jalan di port ini
  credentials: true
}));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:3000", "http://localhost:5050", "blob:"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin for images
}));
app.use(express.json());

// =============================
// 🔹 Routes
// =============================
app.get("/", (req, res) => {
  res.send("Backend is running securely ✅ with routes and DB connection");
});

// Serve static files dari folder uploads
app.use("/uploads", express.static("uploads"));

// Semua route user disimpan di userRoutes.js
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);

// =============================
// 🔹 Jalankan server
// =============================
app.listen(PORT, () => {
  console.log(`✅ Secure server running on http://localhost:${PORT}`);
});
