import pool from "../config/db.js";

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT
        o.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.phone as customer_phone
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data pesanan" });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get order details
    const [order] = await pool.query(`
      SELECT
        o.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.phone as customer_phone,
        c.email as customer_email,
        ba.address_line_1 as billing_address_1,
        ba.address_line_2 as billing_address_2,
        ba.city as billing_city,
        ba.state as billing_state,
        ba.postal_code as billing_postal,
        ba.country as billing_country,
        sa.address_line_1 as shipping_address_1,
        sa.address_line_2 as shipping_address_2,
        sa.city as shipping_city,
        sa.state as shipping_state,
        sa.postal_code as shipping_postal,
        sa.country as shipping_country
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN customer_addresses ba ON o.billing_address_id = ba.id
      LEFT JOIN customer_addresses sa ON o.shipping_address_id = sa.id
      WHERE o.id = ?
    `, [id]);

    if (order.length === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    // Get order items
    const [items] = await pool.query(`
      SELECT
        oi.*,
        p.name as product_name,
        p.sku as product_sku,
        pi.image_url as product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE oi.order_id = ?
    `, [id]);

    // Get payment info
    const [payments] = await pool.query(`
      SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC
    `, [id]);

    // Get refunds
    const [refunds] = await pool.query(`
      SELECT r.*, u.name as processed_by_name
      FROM refunds r
      LEFT JOIN users u ON r.processed_by = u.id
      WHERE r.order_id = ?
      ORDER BY r.created_at DESC
    `, [id]);

    res.json({
      ...order[0],
      items,
      payments,
      refunds
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data pesanan" });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Status pesanan tidak valid" });
    }

    // Update order status
    await pool.query(
      "UPDATE orders SET status = ?, notes = CONCAT(IFNULL(notes, ''), ?), updated_at = NOW() WHERE id = ?",
      [status, notes ? `\n[${new Date().toISOString()}] ${notes}` : '', id]
    );

    // Log activity
    await pool.query(
      "INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, 'update_order_status', 'order', id, JSON.stringify({ status, notes })]
    );

    res.json({ message: "Status pesanan berhasil diupdate" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update status pesanan" });
  }
};

// Update tracking information
export const updateTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const { tracking_number, shipping_method } = req.body;

    await pool.query(
      "UPDATE orders SET tracking_number = ?, shipping_method = ?, updated_at = NOW() WHERE id = ?",
      [tracking_number, shipping_method, id]
    );

    // Log activity
    await pool.query(
      "INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, 'update_tracking', 'order', id, JSON.stringify({ tracking_number, shipping_method })]
    );

    res.json({ message: "Informasi tracking berhasil diupdate" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update tracking" });
  }
};

// Create refund
export const createRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    // Get order details
    const [order] = await pool.query("SELECT total_amount, status FROM orders WHERE id = ?", [id]);
    if (order.length === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    if (amount > order[0].total_amount) {
      return res.status(400).json({ message: "Jumlah refund tidak boleh melebihi total pesanan" });
    }

    // Create refund record
    await pool.query(`
      INSERT INTO refunds (order_id, amount, reason, status, processed_by)
      VALUES (?, ?, ?, 'pending', ?)
    `, [id, amount, reason, req.user.id]);

    // Update order status
    await pool.query("UPDATE orders SET status = 'refunded' WHERE id = ?", [id]);

    // Log activity
    await pool.query(
      "INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, 'create_refund', 'order', id, JSON.stringify({ amount, reason })]
    );

    res.json({ message: "Refund berhasil dibuat" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membuat refund" });
  }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_order_value
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    res.json(stats[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil statistik pesanan" });
  }
};

// Generate invoice
export const printInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    // Get order with full details for invoice
    const [order] = await pool.query(`
      SELECT
        o.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.phone as customer_phone,
        c.email as customer_email,
        ba.address_line_1 as billing_address_1,
        ba.city as billing_city,
        ba.postal_code as billing_postal,
        ba.country as billing_country
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN customer_addresses ba ON o.billing_address_id = ba.id
      WHERE o.id = ?
    `, [id]);

    if (order.length === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    // Get order items
    const [items] = await pool.query(`
      SELECT
        oi.product_name,
        oi.quantity,
        oi.unit_price,
        oi.total_price,
        oi.product_sku
      FROM order_items oi
      WHERE oi.order_id = ?
    `, [id]);

    // Simple invoice HTML (in production, use PDF library)
    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice #${order[0].order_number}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { text-align: center; margin-bottom: 30px; }
            .customer-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .total { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <p>Order #${order[0].order_number}</p>
            <p>Date: ${new Date(order[0].created_at).toLocaleDateString()}</p>
          </div>

          <div class="customer-info">
            <h3>Bill To:</h3>
            <p>${order[0].customer_name}</p>
            <p>${order[0].billing_address_1}</p>
            <p>${order[0].billing_city}, ${order[0].billing_postal}</p>
            <p>${order[0].billing_country}</p>
            <p>Email: ${order[0].customer_email}</p>
            <p>Phone: ${order[0].customer_phone}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.product_name}</td>
                  <td>${item.product_sku}</td>
                  <td>${item.quantity}</td>
                  <td>Rp ${item.unit_price.toLocaleString()}</td>
                  <td>Rp ${item.total_price.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="text-align: right; margin-top: 20px;">
            <p>Subtotal: Rp ${order[0].subtotal.toLocaleString()}</p>
            <p>Shipping: Rp ${order[0].shipping_amount.toLocaleString()}</p>
            <p>Tax: Rp ${order[0].tax_amount.toLocaleString()}</p>
            <p class="total">Total: Rp ${order[0].total_amount.toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(invoiceHtml);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal generate invoice" });
  }
};
