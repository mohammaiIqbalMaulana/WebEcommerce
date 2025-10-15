import express from "express";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import validator from "validator";


const router = express.Router();

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // validasi input
    // validasi input dasar
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi!" });
    }

    // validasi format email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Format email tidak valid!" });
    }

    // validasi kekuatan password
    // minimal 8 karakter, ada huruf besar, huruf kecil, dan angka
    const strongPasswordOptions = {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0
    };
    if (!validator.isStrongPassword(password, strongPasswordOptions)) {
      return res.status(400).json({
        message: "Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, serta angka!"
      });
    }

    // validasi role
    const validRoles = ['admin', 'user'];
    const userRole = role && validRoles.includes(role) ? role : 'user';

    // cek apakah email sudah ada
    const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan!" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // simpan user baru
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, userRole]
    );

    res.status(201).json({ message: "Registrasi berhasil!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

import jwt from "jsonwebtoken";

// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validasi input
    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi!" });
    }

    // cek user di database
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan!" });
    }

    const foundUser = user[0];

    // cek password
    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Password salah!" });
    }

    // buat token JWT
    const token = jwt.sign(
      { id: foundUser.id, email: foundUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login berhasil!",
      token,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

import verifyToken from "../middleware/authMiddleware.js";

// Route untuk menguji token
router.get("/me", verifyToken, async (req, res) => {
  try {
    const [user] = await pool.query("SELECT id, name, email, role FROM users WHERE id = ?", [req.user.id]);
    if (user.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.json({ user: user[0] });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

export default router;
