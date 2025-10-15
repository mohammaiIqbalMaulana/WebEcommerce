import pool from "../config/db.js";

// GET semua produk
export const getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data produk" });
  }
};

// TAMBAH produk
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price) {
      return res.status(400).json({ message: "Nama dan harga wajib diisi" });
    }

    await pool.query(
      "INSERT INTO products (name, description, price, category, stock, image) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, price, category, stock, image]
    );

    res.status(201).json({ message: "Produk berhasil ditambahkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambah produk" });
  }
};
