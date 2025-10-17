import pool from "../config/db.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get overall stats
    const [overallStats] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as orders_this_month,
        (SELECT SUM(total_amount) FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as revenue_this_month,
        (SELECT COUNT(*) FROM customers) as total_customers,
        (SELECT COUNT(*) FROM products WHERE is_active = TRUE) as total_products,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders
      FROM dual
    `);

    // Get sales chart data (last 12 months)
    const [salesData] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as orders,
        SUM(total_amount) as revenue
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month
    `);

    // Get top products
    const [topProducts] = await pool.query(`
      SELECT
        p.name,
        p.sku,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as total_revenue
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY p.id, p.name, p.sku
      ORDER BY total_sold DESC
      LIMIT 10
    `);

    // Get low stock alerts
    const [lowStockProducts] = await pool.query(`
      SELECT
        name,
        sku,
        stock_quantity,
        low_stock_threshold
      FROM products
      WHERE stock_quantity <= low_stock_threshold
      AND track_inventory = TRUE
      AND is_active = TRUE
      ORDER BY stock_quantity ASC
      LIMIT 10
    `);

    res.json({
      overall: overallStats[0],
      sales_chart: salesData,
      top_products: topProducts,
      low_stock_alerts: lowStockProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data dashboard" });
  }
};

// Get sales report
export const getSalesReport = async (req, res) => {
  try {
    const { start_date, end_date, group_by = 'day' } = req.query;

    let dateFormat, groupField;
    switch (group_by) {
      case 'month':
        dateFormat = '%Y-%m';
        groupField = 'Month';
        break;
      case 'week':
        dateFormat = '%Y-%u';
        groupField = 'Week';
        break;
      default:
        dateFormat = '%Y-%m-%d';
        groupField = 'Date';
    }

    const [salesData] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, ?) as period,
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_order_value,
        SUM(subtotal) as subtotal,
        SUM(tax_amount) as total_tax,
        SUM(shipping_amount) as total_shipping,
        SUM(discount_amount) as total_discounts
      FROM orders
      WHERE created_at BETWEEN ? AND ?
      AND status IN ('paid', 'processing', 'shipped', 'delivered')
      GROUP BY DATE_FORMAT(created_at, ?)
      ORDER BY period
    `, [dateFormat, start_date || '2020-01-01', end_date || new Date().toISOString().split('T')[0], dateFormat]);

    res.json({
      period: groupField,
      data: salesData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil laporan penjualan" });
  }
};

// Get customer report
export const getCustomerReport = async (req, res) => {
  try {
    const [customerData] = await pool.query(`
      SELECT
        COUNT(*) as total_customers,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_customers_this_month,
        COUNT(CASE WHEN last_order_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as active_customers,
        AVG(total_spent) as avg_customer_lifetime_value,
        SUM(total_spent) as total_customer_value
      FROM (
        SELECT
          c.id,
          c.created_at,
          MAX(o.created_at) as last_order_date,
          SUM(o.total_amount) as total_spent
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        GROUP BY c.id, c.created_at
      ) as customer_summary
    `);

    // Customer acquisition by month
    const [acquisitionData] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as new_customers
      FROM customers
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month
    `);

    res.json({
      summary: customerData[0],
      acquisition_chart: acquisitionData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil laporan pelanggan" });
  }
};

// Get inventory report
export const getInventoryReport = async (req, res) => {
  try {
    // Overall inventory stats
    const [inventoryStats] = await pool.query(`
      SELECT
        COUNT(*) as total_products,
        SUM(stock_quantity) as total_stock_value,
        COUNT(CASE WHEN stock_quantity <= low_stock_threshold THEN 1 END) as low_stock_products,
        COUNT(CASE WHEN stock_quantity = 0 THEN 1 END) as out_of_stock_products,
        AVG(stock_quantity) as avg_stock_level
      FROM products
      WHERE track_inventory = TRUE
      AND is_active = TRUE
    `);

    // Inventory by category
    const [inventoryByCategory] = await pool.query(`
      SELECT
        c.name as category_name,
        COUNT(p.id) as product_count,
        SUM(p.stock_quantity) as total_stock,
        AVG(p.stock_quantity) as avg_stock
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      WHERE p.track_inventory = TRUE
      AND p.is_active = TRUE
      GROUP BY c.id, c.name
      ORDER BY total_stock DESC
    `);

    // Low stock products
    const [lowStockProducts] = await pool.query(`
      SELECT
        name,
        sku,
        stock_quantity,
        low_stock_threshold,
        category_id
      FROM products
      WHERE stock_quantity <= low_stock_threshold
      AND track_inventory = TRUE
      AND is_active = TRUE
      ORDER BY (low_stock_threshold - stock_quantity) DESC
      LIMIT 20
    `);

    res.json({
      summary: inventoryStats[0],
      by_category: inventoryByCategory,
      low_stock_products: lowStockProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil laporan inventori" });
  }
};

// Get product performance report
export const getProductPerformanceReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const [productPerformance] = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.sku,
        p.price,
        p.stock_quantity,
        COALESCE(SUM(oi.quantity), 0) as units_sold,
        COALESCE(SUM(oi.total_price), 0) as revenue,
        COALESCE(AVG(oi.unit_price), 0) as avg_selling_price,
        COUNT(DISTINCT o.customer_id) as unique_customers
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.created_at BETWEEN ? AND ?
      WHERE p.is_active = TRUE
      GROUP BY p.id, p.name, p.sku, p.price, p.stock_quantity
      ORDER BY revenue DESC
      LIMIT 50
    `, [start_date || '2020-01-01', end_date || new Date().toISOString().split('T')[0]]);

    res.json({
      products: productPerformance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil laporan performa produk" });
  }
};
