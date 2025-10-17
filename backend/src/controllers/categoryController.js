import pool from "../config/db.js";

// GET semua kategori
export const getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT
        c.*,
        COUNT(p.id) as product_count,
        c.created_at
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data kategori" });
  }
};

// GET kategori by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [category] = await pool.query(`
      SELECT
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [id]);

    if (category.length === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    res.json(category[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data kategori" });
  }
};

// TAMBAH kategori
export const addCategory = async (req, res) => {
  try {
    const { name, description, parent_id, image, is_active, seo_title, seo_description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nama kategori wajib diisi" });
    }

    // Check if category name already exists
    const [existingCategory] = await pool.query("SELECT id FROM categories WHERE name = ?", [name]);
    if (existingCategory.length > 0) {
      return res.status(400).json({ message: "Nama kategori sudah digunakan" });
    }

    const imageFilename = req.file ? req.file.filename : null;

    await pool.query(`
      INSERT INTO categories (name, description, parent_id, image, is_active, seo_title, seo_description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [name, description, parent_id, imageFilename, is_active !== false, seo_title, seo_description]);

    res.status(201).json({ message: "Kategori berhasil ditambahkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambah kategori" });
  }
};

// UPDATE kategori
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parent_id, image, is_active, seo_title, seo_description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nama kategori wajib diisi" });
    }

    // Check if category exists
    const [existingCategory] = await pool.query("SELECT id FROM categories WHERE id = ?", [id]);
    if (existingCategory.length === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    // Check name uniqueness (excluding current category)
    const [existingName] = await pool.query("SELECT id FROM categories WHERE name = ? AND id != ?", [name, id]);
    if (existingName.length > 0) {
      return res.status(400).json({ message: "Nama kategori sudah digunakan" });
    }

    const imageFilename = req.file ? req.file.filename : image;

    await pool.query(`
      UPDATE categories SET
        name = ?, description = ?, parent_id = ?, image = ?, is_active = ?,
        seo_title = ?, seo_description = ?, updated_at = NOW()
      WHERE id = ?
    `, [name, description, parent_id, imageFilename, is_active !== false, seo_title, seo_description, id]);

    res.json({ message: "Kategori berhasil diupdate" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update kategori" });
  }
};

// DELETE kategori
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const [existingCategory] = await pool.query("SELECT id FROM categories WHERE id = ?", [id]);
    if (existingCategory.length === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    // Check if category has products
    const [products] = await pool.query("SELECT COUNT(*) as count FROM products WHERE category_id = ?", [id]);
    if (products[0].count > 0) {
      return res.status(400).json({ message: "Tidak dapat menghapus kategori yang masih memiliki produk" });
    }

    await pool.query("DELETE FROM categories WHERE id = ?", [id]);

    res.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus kategori" });
  }
};
