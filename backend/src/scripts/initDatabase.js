import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...');

    // Execute table creation statements directly
    const tableStatements = [
      `CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('superadmin', 'admin_produk', 'fulfillment', 'finance', 'user') DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        parent_id INT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
      )`,

      `CREATE TABLE product_attributes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        type ENUM('text', 'number', 'select', 'multiselect') DEFAULT 'text',
        options JSON NULL,
        is_required BOOLEAN DEFAULT FALSE,
        is_filterable BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(100) UNIQUE NOT NULL,
        description LONGTEXT,
        short_description TEXT,
        price DECIMAL(10,2) NOT NULL,
        compare_price DECIMAL(10,2) NULL,
        cost_price DECIMAL(10,2) NULL,
        weight DECIMAL(8,3) NULL,
        category_id INT,
        brand VARCHAR(255),
        tags JSON,
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        track_inventory BOOLEAN DEFAULT TRUE,
        stock_quantity INT DEFAULT 0,
        low_stock_threshold INT DEFAULT 5,
        allow_backorders BOOLEAN DEFAULT FALSE,
        requires_shipping BOOLEAN DEFAULT TRUE,
        seo_title VARCHAR(255),
        seo_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )`,

      `CREATE TABLE product_variations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        sku VARCHAR(100) UNIQUE,
        price DECIMAL(10,2),
        compare_price DECIMAL(10,2),
        cost_price DECIMAL(10,2),
        weight DECIMAL(8,3),
        stock_quantity INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE variation_attributes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        variation_id INT NOT NULL,
        attribute_id INT NOT NULL,
        attribute_value VARCHAR(255) NOT NULL,
        FOREIGN KEY (variation_id) REFERENCES product_variations(id) ON DELETE CASCADE,
        FOREIGN KEY (attribute_id) REFERENCES product_attributes(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE product_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        variation_id INT NULL,
        image_url VARCHAR(500) NOT NULL,
        alt_text VARCHAR(255),
        sort_order INT DEFAULT 0,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (variation_id) REFERENCES product_variations(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE product_attribute_values (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        attribute_id INT NOT NULL,
        attribute_value VARCHAR(255) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (attribute_id) REFERENCES product_attributes(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE customers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNIQUE,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        phone VARCHAR(20),
        date_of_birth DATE,
        gender ENUM('male', 'female', 'other'),
        company VARCHAR(255),
        tax_id VARCHAR(50),
        notes TEXT,
        total_orders INT DEFAULT 0,
        total_spent DECIMAL(10,2) DEFAULT 0,
        last_order_date TIMESTAMP NULL,
        is_banned BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE customer_addresses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        type ENUM('billing', 'shipping') DEFAULT 'shipping',
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        company VARCHAR(255),
        address_line_1 VARCHAR(255) NOT NULL,
        address_line_2 VARCHAR(255),
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255),
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        customer_id INT NOT NULL,
        status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned') DEFAULT 'pending',
        subtotal DECIMAL(10,2) NOT NULL,
        tax_amount DECIMAL(10,2) DEFAULT 0,
        shipping_amount DECIMAL(10,2) DEFAULT 0,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        total_amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'IDR',
        payment_method VARCHAR(100),
        payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
        shipping_method VARCHAR(100),
        tracking_number VARCHAR(100),
        notes TEXT,
        billing_address_id INT,
        shipping_address_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (billing_address_id) REFERENCES customer_addresses(id),
        FOREIGN KEY (shipping_address_id) REFERENCES customer_addresses(id)
      )`,

      `CREATE TABLE order_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        variation_id INT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_sku VARCHAR(100),
        quantity INT NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (variation_id) REFERENCES product_variations(id)
      )`,

      `CREATE TABLE payments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'IDR',
        payment_method VARCHAR(100) NOT NULL,
        transaction_id VARCHAR(255),
        status ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
        payment_date TIMESTAMP NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE refunds (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        payment_id INT,
        amount DECIMAL(10,2) NOT NULL,
        reason TEXT,
        status ENUM('pending', 'approved', 'rejected', 'processed') DEFAULT 'pending',
        processed_by INT,
        processed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (payment_id) REFERENCES payments(id),
        FOREIGN KEY (processed_by) REFERENCES users(id)
      )`,

      `CREATE TABLE inventory_adjustments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        variation_id INT NULL,
        adjustment_type ENUM('manual', 'sale', 'return', 'restock', 'damaged', 'lost') DEFAULT 'manual',
        quantity_change INT NOT NULL,
        reason TEXT,
        reference_id INT NULL,
        adjusted_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (variation_id) REFERENCES product_variations(id) ON DELETE CASCADE,
        FOREIGN KEY (adjusted_by) REFERENCES users(id)
      )`,

      `CREATE TABLE warehouses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        address TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE product_warehouse_stock (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        variation_id INT NULL,
        warehouse_id INT NOT NULL,
        quantity INT DEFAULT 0,
        reserved_quantity INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (variation_id) REFERENCES product_variations(id) ON DELETE CASCADE,
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE coupons (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        type ENUM('percentage', 'fixed_amount', 'free_shipping') DEFAULT 'percentage',
        value DECIMAL(10,2) NOT NULL,
        min_order_amount DECIMAL(10,2) DEFAULT 0,
        max_discount_amount DECIMAL(10,2) NULL,
        usage_limit INT NULL,
        usage_limit_per_user INT DEFAULT 1,
        used_count INT DEFAULT 0,
        starts_at TIMESTAMP NULL,
        expires_at TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE,
        applicable_products JSON,
        applicable_categories JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE coupon_usage (
        id INT PRIMARY KEY AUTO_INCREMENT,
        coupon_id INT NOT NULL,
        order_id INT NOT NULL,
        customer_id INT NOT NULL,
        discount_amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE shipping_zones (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        countries JSON NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE shipping_rates (
        id INT PRIMARY KEY AUTO_INCREMENT,
        zone_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        condition_type ENUM('weight', 'price', 'quantity') DEFAULT 'weight',
        min_value DECIMAL(10,2) DEFAULT 0,
        max_value DECIMAL(10,2) NULL,
        rate DECIMAL(10,2) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (zone_id) REFERENCES shipping_zones(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE cms_pages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content LONGTEXT,
        meta_title VARCHAR(255),
        meta_description TEXT,
        is_published BOOLEAN DEFAULT FALSE,
        published_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE banners (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        link_url VARCHAR(500),
        position VARCHAR(100),
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        starts_at TIMESTAMP NULL,
        expires_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        key_name VARCHAR(255) UNIQUE NOT NULL,
        value TEXT,
        type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
        category VARCHAR(100) DEFAULT 'general',
        is_public BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE audit_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        action VARCHAR(255) NOT NULL,
        resource_type VARCHAR(100) NOT NULL,
        resource_id INT,
        old_values JSON,
        new_values JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )`,

      `CREATE TABLE user_sessions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE user_2fa (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNIQUE NOT NULL,
        secret VARCHAR(255) NOT NULL,
        backup_codes JSON,
        is_enabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`
    ];

    // Execute table creation
    for (let i = 0; i < tableStatements.length; i++) {
      try {
        await db.execute(tableStatements[i]);
        console.log(`✅ Created table ${i + 1}/${tableStatements.length}`);
      } catch (error) {
        console.log(`❌ Error creating table ${i + 1}: ${error.message}`);
      }
    }

    // Insert default data
    console.log('📝 Inserting default data...');
    const insertStatements = [
      `INSERT INTO settings (key_name, value, type, category) VALUES
      ('store_name', 'My E-commerce Store', 'string', 'store'),
      ('store_email', 'admin@store.com', 'string', 'store'),
      ('store_currency', 'IDR', 'string', 'store'),
      ('store_timezone', 'Asia/Jakarta', 'string', 'store'),
      ('tax_rate', '10', 'number', 'tax'),
      ('low_stock_threshold', '5', 'number', 'inventory'),
      ('order_number_prefix', 'ORD', 'string', 'orders'),
      ('allow_guest_checkout', 'false', 'boolean', 'checkout'),
      ('maintenance_mode', 'false', 'boolean', 'system')`,

      `INSERT INTO categories (name, description) VALUES
      ('Electronics', 'Electronic devices and accessories'),
      ('Clothing', 'Fashion and apparel'),
      ('Home & Garden', 'Home improvement and garden supplies'),
      ('Sports & Outdoors', 'Sports equipment and outdoor gear'),
      ('Books', 'Books and publications')`,

      `INSERT INTO product_attributes (name, type, options, is_required, is_filterable) VALUES
      ('Color', 'select', '["Red", "Blue", "Green", "Black", "White"]', false, true),
      ('Size', 'select', '["XS", "S", "M", "L", "XL", "XXL"]', false, true),
      ('Material', 'text', null, false, false),
      ('Brand', 'text', null, false, true)`
    ];

    for (const insertStmt of insertStatements) {
      try {
        await db.execute(insertStmt);
        console.log('✅ Inserted default data');
      } catch (error) {
        console.log(`❌ Error inserting data: ${error.message}`);
      }
    }

    // Create indexes
    console.log('🔧 Creating indexes...');
    const indexStatements = [
      'CREATE INDEX idx_products_category ON products(category_id)',
      'CREATE INDEX idx_products_sku ON products(sku)',
      'CREATE INDEX idx_products_active ON products(is_active)',
      'CREATE INDEX idx_product_variations_product ON product_variations(product_id)',
      'CREATE INDEX idx_orders_customer ON orders(customer_id)',
      'CREATE INDEX idx_orders_status ON orders(status)',
      'CREATE INDEX idx_orders_created ON orders(created_at)',
      'CREATE INDEX idx_order_items_order ON order_items(order_id)',
      'CREATE INDEX idx_payments_order ON payments(order_id)',
      'CREATE INDEX idx_inventory_adjustments_product ON inventory_adjustments(product_id)',
      'CREATE INDEX idx_audit_logs_user ON audit_logs(user_id)',
      'CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id)'
    ];

    for (const indexStmt of indexStatements) {
      try {
        await db.execute(indexStmt);
        console.log(`✅ Created index: ${indexStmt.split(' ON ')[0]}`);
      } catch (error) {
        console.log(`⚠️  Could not create index: ${error.message}`);
      }
    }

    console.log('🎉 Database initialization completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
