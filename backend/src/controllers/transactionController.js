import pool from "../config/db.js";

// Get all transactions (payments)
export const getAllTransactions = async (req, res) => {
  try {
    const [transactions] = await pool.query(`
      SELECT
        p.*,
        o.order_number,
        c.first_name,
        c.last_name,
        u.name as processed_by_name
      FROM payments p
      LEFT JOIN orders o ON p.order_id = o.id
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN users u ON p.created_at = u.created_at
      ORDER BY p.created_at DESC
    `);
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data transaksi" });
  }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [transaction] = await pool.query(`
      SELECT
        p.*,
        o.order_number,
        c.first_name,
        c.last_name,
        u.name as processed_by_name
      FROM payments p
      LEFT JOIN orders o ON p.order_id = o.id
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN users u ON p.created_at = u.created_at
      WHERE p.id = ?
    `, [id]);

    if (transaction.length === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    res.json(transaction[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data transaksi" });
  }
};

// Process refund
export const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    // Get transaction details
    const [transaction] = await pool.query("SELECT * FROM payments WHERE id = ?", [id]);
    if (transaction.length === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    const payment = transaction[0];

    // Check if refund amount is valid
    if (amount > payment.amount) {
      return res.status(400).json({ message: "Jumlah refund tidak boleh melebihi jumlah pembayaran" });
    }

    // Create refund record
    await pool.query(`
      INSERT INTO refunds (order_id, payment_id, amount, reason, status, processed_by)
      VALUES (?, ?, ?, ?, 'processed', ?)
    `, [payment.order_id, id, amount, reason, req.user.id]);

    // Update payment status
    await pool.query(
      "UPDATE payments SET status = 'refunded' WHERE id = ?",
      [id]
    );

    // Update order status
    await pool.query(
      "UPDATE orders SET status = 'refunded' WHERE id = ?",
      [payment.order_id]
    );

    res.json({ message: "Refund berhasil diproses" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memproses refund" });
  }
};

// Get transaction statistics
export const getTransactionStats = async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
        SUM(CASE WHEN status = 'refunded' THEN amount ELSE 0 END) as total_refunds,
        AVG(CASE WHEN status = 'completed' THEN amount ELSE NULL END) as avg_transaction_value
      FROM payments
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    res.json(stats[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil statistik transaksi" });
  }
};
