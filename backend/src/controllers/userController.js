import pool from "../config/db.js";
import bcrypt from "bcryptjs";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT id, name, email, role, is_active, last_login, created_at
      FROM users
      ORDER BY created_at DESC
    `);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data pengguna" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [user] = await pool.query(`
      SELECT id, name, email, role, is_active, last_login, created_at, updated_at
      FROM users
      WHERE id = ?
    `, [id]);

    if (user.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    res.json(user[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data pengguna" });
  }
};

// Create new user (admin only)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Check if email exists
    const [existingUser] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    // Validate role
    const validRoles = ['superadmin', 'admin_produk', 'fulfillment', 'finance', 'user'];
    const userRole = validRoles.includes(role) ? role : 'user';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, userRole]
    );

    res.status(201).json({
      message: "Pengguna berhasil dibuat",
      userId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membuat pengguna" });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, is_active } = req.body;

    // Check if user exists
    const [existingUser] = await pool.query("SELECT id FROM users WHERE id = ?", [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    // Check if email is taken by another user
    if (email) {
      const [emailCheck] = await pool.query("SELECT id FROM users WHERE email = ? AND id != ?", [email, id]);
      if (emailCheck.length > 0) {
        return res.status(400).json({ message: "Email sudah digunakan" });
      }
    }

    // Validate role
    const validRoles = ['superadmin', 'admin_produk', 'fulfillment', 'finance', 'user'];
    const userRole = validRoles.includes(role) ? role : undefined;

    // Build update query
    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }
    if (userRole) {
      updateFields.push("role = ?");
      updateValues.push(userRole);
    }
    if (typeof is_active === 'boolean') {
      updateFields.push("is_active = ?");
      updateValues.push(is_active);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "Tidak ada field yang diupdate" });
    }

    updateValues.push(id);

    await pool.query(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    res.json({ message: "Pengguna berhasil diupdate" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update pengguna" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting self
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: "Tidak dapat menghapus akun sendiri" });
    }

    // Check if user exists
    const [existingUser] = await pool.query("SELECT id FROM users WHERE id = ?", [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    // Delete user
    await pool.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ message: "Pengguna berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus pengguna" });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { current_password, new_password } = req.body;

    // Get user
    const [user] = await pool.query("SELECT password FROM users WHERE id = ?", [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    // Verify current password (only if not admin changing someone else's password)
    if (parseInt(id) === req.user.id) {
      const validPassword = await bcrypt.compare(current_password, user[0].password);
      if (!validPassword) {
        return res.status(400).json({ message: "Password saat ini salah" });
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id]);

    res.json({ message: "Password berhasil diubah" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengubah password" });
  }
};

// Get user activity logs
export const getUserActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const [logs] = await pool.query(`
      SELECT action, resource_type, created_at, ip_address
      FROM audit_logs
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `, [id]);

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil log aktivitas" });
  }
};
