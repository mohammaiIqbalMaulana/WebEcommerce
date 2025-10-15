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
app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000", // nanti frontend jalan di port ini
  credentials: true
}));
app.use(express.json());

// =============================
// 🔹 Routes
// =============================
app.get("/", (req, res) => {
  res.send("Backend is running securely ✅ with routes and DB connection");
});

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
