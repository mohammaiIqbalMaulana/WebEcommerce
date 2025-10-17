import pool from "../config/db.js";
import multer from "multer";

// Configure multer for multiple images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.random().toString(36).substr(2, 9) + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// GET semua produk dengan detail lengkap
export const getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT
        p.*,
        c.name as category_name,
        COUNT(DISTINCT pv.id) as variation_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variations pv ON p.id = pv.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    // Get images for each product
    for (let product of products) {
      const [images] = await pool.query(`
        SELECT * FROM product_images
        WHERE product_id = ?
        ORDER BY is_primary DESC, sort_order ASC
      `, [product.id]);
      product.images = images;
    }

    // Get variations for each product
    for (let product of products) {
      const [variations] = await pool.query(`
        SELECT pv.*, GROUP_CONCAT(pva.attribute_value) as attributes
        FROM product_variations pv
        LEFT JOIN variation_attributes va ON pv.id = va.variation_id
        LEFT JOIN product_attributes pa ON va.attribute_id = pa.id
        LEFT JOIN product_attribute_values pva ON va.attribute_id = pva.attribute_id AND pv.product_id = pva.product_id
        WHERE pv.product_id = ?
        GROUP BY pv.id
      `, [product.id]);

      product.variations = variations;
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data produk" });
  }
};

// GET produk by ID dengan detail lengkap
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get main product data
    const [product] = await pool.query(`
      SELECT
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (product.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Get product images
    const [images] = await pool.query(`
      SELECT * FROM product_images
      WHERE product_id = ?
      ORDER BY sort_order, is_primary DESC
    `, [id]);

    // Get product variations
    const [variations] = await pool.query(`
      SELECT
        pv.*,
        GROUP_CONCAT(DISTINCT va.attribute_value) as attributes
      FROM product_variations pv
      LEFT JOIN variation_attributes va ON pv.id = va.variation_id
      WHERE pv.product_id = ?
      GROUP BY pv.id
    `, [id]);

    // Get product attributes
    const [attributes] = await pool.query(`
      SELECT
        pa.name,
        pa.type,
        pa.options,
        pva.attribute_value
      FROM product_attributes pa
      JOIN product_attribute_values pva ON pa.id = pva.attribute_id
      WHERE pva.product_id = ?
    `, [id]);

    res.json({
      ...product[0],
      images,
      variations,
      attributes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data produk" });
  }
};

// TAMBAH produk dengan fitur lengkap
export const addProduct = async (req, res) => {
  try {
    const {
      name, sku, description, short_description, price, compare_price, cost_price,
      weight, category_id, brand, tags, is_featured, seo_title, seo_description,
      track_inventory, stock_quantity, low_stock_threshold, allow_backorders,
      requires_shipping, attributes, variations
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Nama dan harga wajib diisi" });
    }

    if (sku) {
      const [existingSKU] = await pool.query("SELECT id FROM products WHERE sku = ?", [sku]);
      if (existingSKU.length > 0) {
        return res.status(400).json({ message: "SKU sudah digunakan" });
      }
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert main product
    const [result] = await connection.query(`
      INSERT INTO products (
        name, sku, description, short_description, price, compare_price, cost_price,
        weight, category_id, brand, tags, is_featured, seo_title, seo_description,
        track_inventory, stock_quantity, low_stock_threshold, allow_backorders,
        requires_shipping
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, sku, description, short_description, price, compare_price, cost_price,
      weight, category_id, brand, tags ? JSON.stringify(tags) : null, is_featured ? 1 : 0,
      seo_title, seo_description, track_inventory !== false ? 1 : 0, stock_quantity || 0,
      low_stock_threshold || 5, allow_backorders ? 1 : 0, requires_shipping !== false ? 1 : 0
    ]);

      const productId = result.insertId;

      // Handle multiple images
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          await connection.query(`
            INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
            VALUES (?, ?, ?, ?)
          `, [productId, file.filename, i === 0, i]);
        }
      }

      // Handle attributes
      if (attributes && Array.isArray(attributes)) {
        for (const attr of attributes) {
          await connection.query(`
            INSERT INTO product_attribute_values (product_id, attribute_id, attribute_value)
            VALUES (?, ?, ?)
          `, [productId, attr.attribute_id, attr.value]);
        }
      }

      // Handle variations
      if (variations && Array.isArray(variations)) {
        for (const variation of variations) {
          const [varResult] = await connection.query(`
            INSERT INTO product_variations (
              product_id, sku, price, compare_price, cost_price, weight, stock_quantity
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            productId, variation.sku, variation.price, variation.compare_price,
            variation.cost_price, variation.weight, variation.stock_quantity || 0
          ]);

          // Add variation attributes
          if (variation.attributes && Array.isArray(variation.attributes)) {
            for (const attr of variation.attributes) {
              await connection.query(`
                INSERT INTO variation_attributes (variation_id, attribute_id, attribute_value)
                VALUES (?, ?, ?)
              `, [varResult.insertId, attr.attribute_id, attr.value]);
            }
          }
        }
      }

      await connection.commit();

      // Log activity
      await pool.query(
        "INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES (?, ?, ?, ?, ?)",
        [req.user.id, 'create_product', 'product', productId, JSON.stringify({ name, sku, price })]
      );

      res.status(201).json({ message: "Produk berhasil ditambahkan", productId });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambah produk" });
  }
};

// UPDATE produk dengan fitur lengkap
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, sku, description, short_description, price, compare_price, cost_price,
      weight, category_id, brand, tags, is_featured, seo_title, seo_description,
      track_inventory, stock_quantity, low_stock_threshold, allow_backorders,
      requires_shipping, attributes, variations
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Nama dan harga wajib diisi" });
    }

    // Check if product exists
    const [existingProduct] = await pool.query("SELECT id FROM products WHERE id = ?", [id]);
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Check SKU uniqueness
    if (sku) {
      const [existingSKU] = await pool.query("SELECT id FROM products WHERE sku = ? AND id != ?", [sku, id]);
      if (existingSKU.length > 0) {
        return res.status(400).json({ message: "SKU sudah digunakan" });
      }
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update main product
      await connection.query(`
        UPDATE products SET
          name = ?, sku = ?, description = ?, short_description = ?, price = ?,
          compare_price = ?, cost_price = ?, weight = ?, category_id = ?, brand = ?,
          tags = ?, is_featured = ?, seo_title = ?, seo_description = ?,
          track_inventory = ?, stock_quantity = ?, low_stock_threshold = ?,
          allow_backorders = ?, requires_shipping = ?, updated_at = NOW()
        WHERE id = ?
      `, [
        name, sku, description, short_description, price, compare_price, cost_price,
        weight, category_id, brand, tags ? JSON.stringify(tags) : null, is_featured ? 1 : 0,
        seo_title, seo_description, track_inventory !== false ? 1 : 0, stock_quantity || 0,
        low_stock_threshold || 5, allow_backorders ? 1 : 0, requires_shipping !== false ? 1 : 0, id
      ]);

      // Handle new images
      if (req.files && req.files.length > 0) {
        // Get current max sort order
        const [maxOrder] = await connection.query(
          "SELECT MAX(sort_order) as max_order FROM product_images WHERE product_id = ?",
          [id]
        );
        let nextOrder = (maxOrder[0].max_order || 0) + 1;

        for (const file of req.files) {
          await connection.query(`
            INSERT INTO product_images (product_id, image_url, sort_order)
            VALUES (?, ?, ?)
          `, [id, file.filename, nextOrder++]);
        }
      }

      // Update attributes (delete old, insert new)
      if (attributes !== undefined) {
        await connection.query("DELETE FROM product_attribute_values WHERE product_id = ?", [id]);

        if (attributes && Array.isArray(attributes)) {
          for (const attr of attributes) {
            await connection.query(`
              INSERT INTO product_attribute_values (product_id, attribute_id, attribute_value)
              VALUES (?, ?, ?)
            `, [id, attr.attribute_id, attr.value]);
          }
        }
      }

      // Update variations (this is complex, simplified version)
      if (variations !== undefined) {
        // For simplicity, delete all existing variations and recreate
        await connection.query("DELETE FROM variation_attributes WHERE variation_id IN (SELECT id FROM product_variations WHERE product_id = ?)", [id]);
        await connection.query("DELETE FROM product_variations WHERE product_id = ?", [id]);

        if (variations && Array.isArray(variations)) {
          for (const variation of variations) {
            const [varResult] = await connection.query(`
              INSERT INTO product_variations (
                product_id, sku, price, compare_price, cost_price, weight, stock_quantity
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
              id, variation.sku, variation.price, variation.compare_price,
              variation.cost_price, variation.weight, variation.stock_quantity || 0
            ]);

            if (variation.attributes && Array.isArray(variation.attributes)) {
              for (const attr of variation.attributes) {
                await connection.query(`
                  INSERT INTO variation_attributes (variation_id, attribute_id, attribute_value)
                  VALUES (?, ?, ?)
                `, [varResult.insertId, attr.attribute_id, attr.value]);
              }
            }
          }
        }
      }

      await connection.commit();

      // Log activity
      await pool.query(
        "INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES (?, ?, ?, ?, ?)",
        [req.user.id, 'update_product', 'product', id, JSON.stringify({ name, sku, price })]
      );

      res.json({ message: "Produk berhasil diupdate" });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update produk" });
  }
};

// DELETE produk
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const [existingProduct] = await pool.query("SELECT id FROM products WHERE id = ?", [id]);
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Delete related data first
      await connection.query("DELETE FROM product_images WHERE product_id = ?", [id]);
      await connection.query("DELETE FROM variation_attributes WHERE variation_id IN (SELECT id FROM product_variations WHERE product_id = ?)", [id]);
      await connection.query("DELETE FROM product_variations WHERE product_id = ?", [id]);
      await connection.query("DELETE FROM product_attribute_values WHERE product_id = ?", [id]);

      // Delete main product
      await connection.query("DELETE FROM products WHERE id = ?", [id]);

      await connection.commit();

      // Log activity
      await pool.query(
        "INSERT INTO audit_logs (user_id, action, resource_type, resource_id) VALUES (?, ?, ?, ?)",
        [req.user.id, 'delete_product', 'product', id]
      );

      res.json({ message: "Produk berhasil dihapus" });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
};

// Bulk update products
export const bulkUpdateProducts = async (req, res) => {
  try {
    const { product_ids, updates } = req.body;

    if (!Array.isArray(product_ids) || product_ids.length === 0) {
      return res.status(400).json({ message: "Product IDs harus berupa array dan tidak kosong" });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Build update query
      const updateFields = [];
      const updateValues = [];

      Object.keys(updates).forEach(key => {
        if (['price', 'stock_quantity', 'is_active', 'is_featured'].includes(key)) {
          updateFields.push(`${key} = ?`);
          updateValues.push(updates[key]);
        }
      });

      if (updateFields.length === 0) {
        return res.status(400).json({ message: "Tidak ada field yang valid untuk diupdate" });
      }

      updateValues.push(...product_ids);

      await connection.query(
        `UPDATE products SET ${updateFields.join(", ")}, updated_at = NOW() WHERE id IN (${product_ids.map(() => "?").join(",")})`,
        updateValues
      );

      await connection.commit();

      // Log activity
      await pool.query(
        "INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES (?, ?, ?, ?, ?)",
        [req.user.id, 'bulk_update_products', 'products', null, JSON.stringify({ count: product_ids.length, updates })]
      );

      res.json({ message: `${product_ids.length} produk berhasil diupdate` });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update produk secara bulk" });
  }
};

// Import products from CSV (placeholder)
export const importProducts = async (req, res) => {
  try {
    // This would parse CSV and create products
    // Implementation depends on CSV format
    res.json({ message: "Import produk dari CSV akan diimplementasikan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal import produk" });
  }
};

// Export products to CSV (placeholder)
export const exportProducts = async (req, res) => {
  try {
    // This would generate CSV from products
    // Implementation depends on requirements
    res.json({ message: "Export produk ke CSV akan diimplementasikan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal export produk" });
  }
};
