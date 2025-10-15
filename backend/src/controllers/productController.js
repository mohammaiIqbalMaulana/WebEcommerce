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

// GET produk by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);

    if (product.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json(product[0]);
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

// UPDATE produk
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price) {
      return res.status(400).json({ message: "Nama dan harga wajib diisi" });
    }

    // Cek apakah produk ada
    const [existingProduct] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Update produk
    if (image) {
      await pool.query(
        "UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ?, image = ? WHERE id = ?",
        [name, description, price, category, stock, image, id]
      );
    } else {
      await pool.query(
        "UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ? WHERE id = ?",
        [name, description, price, category, stock, id]
      );
    }

    res.json({ message: "Produk berhasil diupdate" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update produk" });
  }
};

// DELETE produk
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah produk ada
    const [existingProduct] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Hapus produk
    await pool.query("DELETE FROM products WHERE id = ?", [id]);

    res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
};
