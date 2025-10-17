import pool from "../config/db.js";

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const [customers] = await pool.query(`
      SELECT
        c.*,
        u.email,
        COUNT(o.id) as total_orders,
        SUM(o.total_amount) as total_spent,
        MAX(o.created_at) as last_order_date
      FROM customers c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id, u.email
      ORDER BY c.created_at DESC
    `);
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data pelanggan" });
  }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get customer details
    const [customer] = await pool.query(`
      SELECT
        c.*,
        u.email,
        COUNT(o.id) as total_orders,
        SUM(o.total_amount) as total_spent,
        MAX(o.created_at) as last_order_date
      FROM customers c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN orders o ON c.id = o.customer_id
      WHERE c.id = ?
      GROUP BY c.id, u.email
    `, [id]);

    if (customer.length === 0) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
    }

    // Get customer addresses
    const [addresses] = await pool.query(`
      SELECT * FROM customer_addresses
      WHERE customer_id = ?
      ORDER BY is_default DESC, created_at DESC
    `, [id]);

    // Get customer orders
    const [orders] = await pool.query(`
      SELECT
        o.id,
        o.order_number,
        o.status,
        o.total_amount,
        o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.customer_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `, [id]);

    res.json({
      ...customer[0],
      addresses,
      recent_orders: orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data pelanggan" });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, company, notes } = req.body;

    // Check if customer exists
    const [existingCustomer] = await pool.query("SELECT id FROM customers WHERE id = ?", [id]);
    if (existingCustomer.length === 0) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
    }

    // Update customer
    await pool.query(`
      UPDATE customers
      SET first_name = ?, last_name = ?, phone = ?, company = ?, notes = ?, updated_at = NOW()
      WHERE id = ?
    `, [first_name, last_name, phone, company, notes, id]);

    // Log activity
    await pool.query(
      "INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, 'update_customer', 'customer', id, JSON.stringify({ first_name, last_name, phone, company, notes })]
    );

    res.json({ message: "Data pelanggan berhasil diupdate" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update data pelanggan" });
  }
};

// Toggle customer ban
export const toggleCustomerBan = async (req, res) => {
  try {
    const { id } = req.params;
    const { banned } = req.body;

    // Check if customer exists
    const [existingCustomer] = await pool.query("SELECT id FROM customers WHERE id = ?", [id]);
    if (existingCustomer.length === 0) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
    }

    // Update ban status
    await pool.query(
      "UPDATE customers SET is_banned = ?, updated_at = NOW() WHERE id = ?",
      [banned, id]
    );

    // Log activity
    await pool.query(
      "INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, 'toggle_customer_ban', 'customer', id, JSON.stringify({ is_banned: banned })]
    );

    res.json({ message: `Pelanggan ${banned ? 'berhasil diblokir' : 'berhasil diaktifkan kembali'}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update status pelanggan" });
  }
};

// Get customer notes/history
export const getCustomerNotes = async (req, res) => {
  try {
    const { id } = req.params;

    // Get customer notes (stored in notes field and separate notes table if exists)
    const [customer] = await pool.query("SELECT notes FROM customers WHERE id = ?", [id]);

    // For now, return the notes field. In future, can implement separate notes table
    res.json({
      notes: customer[0]?.notes || '',
      history: [] // Placeholder for future implementation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil catatan pelanggan" });
  }
};

// Add customer note
export const addCustomerNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    // Get current notes
    const [customer] = await pool.query("SELECT notes FROM customers WHERE id = ?", [id]);
    const currentNotes = customer[0]?.notes || '';

    // Append new note
    const timestamp = new Date().toISOString();
    const newNote = `[${timestamp}] ${note}`;
    const updatedNotes = currentNotes ? `${currentNotes}\n\n${newNote}` : newNote;

    // Update customer notes
    await pool.query("UPDATE customers SET notes = ?, updated_at = NOW() WHERE id = ?", [updatedNotes, id]);

    // Log activity
    await pool.query(
      "INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, 'add_customer_note', 'customer', id, JSON.stringify({ note })]
    );

    res.json({ message: "Catatan berhasil ditambahkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan catatan" });
  }
};

// Get customer statistics
export const getCustomerStats = async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT
        COUNT(*) as total_customers,
        SUM(CASE WHEN is_banned = TRUE THEN 1 ELSE 0 END) as banned_customers,
        AVG(total_spent) as avg_customer_value,
        COUNT(CASE WHEN last_order_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as active_customers
      FROM (
        SELECT
          c.id,
          c.is_banned,
          SUM(o.total_amount) as total_spent,
          MAX(o.created_at) as last_order_date
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        GROUP BY c.id, c.is_banned
      ) as customer_summary
    `);

    res.json(stats[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil statistik pelanggan" });
  }
};
