import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // cek apakah ada header Authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Akses ditolak! Token tidak ditemukan." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ambil data user lengkap dari database
    const [user] = await pool.query("SELECT id, name, email, role FROM users WHERE id = ?", [decoded.id]);
    if (user.length === 0) {
      return res.status(401).json({ message: "User tidak ditemukan!" });
    }

    // simpan data user dari database ke request
    req.user = user[0];
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token tidak valid atau sudah kedaluwarsa!" });
  }
};

// Middleware untuk autentikasi (alias untuk verifyToken)
export const authenticateToken = verifyToken;

// Middleware untuk cek role
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Akses ditolak! Anda tidak memiliki permission yang cukup.",
        required_roles: allowedRoles,
        user_role: req.user.role
      });
    }

    next();
  };
};

export default verifyToken;
