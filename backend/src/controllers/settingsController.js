import pool from "../config/db.js";

// Get all settings
export const getAllSettings = async (req, res) => {
  try {
    const [settings] = await pool.query(`
      SELECT key_name, value, type, category, is_public, created_at, updated_at
      FROM settings
      ORDER BY category, key_name
    `);

    // Group by category
    const groupedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    }, {});

    res.json(groupedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil pengaturan" });
  }
};

// Get setting by key
export const getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const [setting] = await pool.query(`
      SELECT key_name, value, type, category, is_public, created_at, updated_at
      FROM settings
      WHERE key_name = ?
    `, [key]);

    if (setting.length === 0) {
      return res.status(404).json({ message: "Pengaturan tidak ditemukan" });
    }

    res.json(setting[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil pengaturan" });
  }
};

// Update setting
export const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    // Check if setting exists
    const [existingSetting] = await pool.query("SELECT id, type FROM settings WHERE key_name = ?", [key]);
    if (existingSetting.length === 0) {
      return res.status(404).json({ message: "Pengaturan tidak ditemukan" });
    }

    // Validate value based on type
    let validatedValue = value;
    switch (existingSetting[0].type) {
      case 'boolean':
        validatedValue = value === 'true' || value === true ? 'true' : 'false';
        break;
      case 'number':
        validatedValue = parseFloat(value).toString();
        break;
      case 'json':
        try {
          JSON.parse(value);
          validatedValue = value;
        } catch (e) {
          return res.status(400).json({ message: "Format JSON tidak valid" });
        }
        break;
    }

    // Update setting
    await pool.query(
      "UPDATE settings SET value = ?, updated_at = NOW() WHERE key_name = ?",
      [validatedValue, key]
    );

    // Log activity
    await pool.query(
      "INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values, new_values) VALUES (?, ?, ?, ?, ?, ?)",
      [req.user.id, 'update_setting', 'setting', existingSetting[0].id, null, JSON.stringify({ key, value: validatedValue })]
    );

    res.json({ message: "Pengaturan berhasil diupdate" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update pengaturan" });
  }
};

// Bulk update settings
export const bulkUpdateSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    if (!Array.isArray(settings)) {
      return res.status(400).json({ message: "Settings harus berupa array" });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      for (const setting of settings) {
        const { key, value } = setting;

        // Check if setting exists
        const [existingSetting] = await connection.query("SELECT id, type FROM settings WHERE key_name = ?", [key]);
        if (existingSetting.length === 0) {
          continue; // Skip non-existent settings
        }

        // Validate and update
        let validatedValue = value;
        switch (existingSetting[0].type) {
          case 'boolean':
            validatedValue = value === 'true' || value === true ? 'true' : 'false';
            break;
          case 'number':
            validatedValue = parseFloat(value).toString();
            break;
          case 'json':
            try {
              JSON.parse(value);
              validatedValue = value;
            } catch (e) {
              continue; // Skip invalid JSON
            }
            break;
        }

        await connection.query(
          "UPDATE settings SET value = ?, updated_at = NOW() WHERE key_name = ?",
          [validatedValue, key]
        );
      }

      await connection.commit();

      // Log activity
      await pool.query(
        "INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES (?, ?, ?, ?, ?)",
        [req.user.id, 'bulk_update_settings', 'settings', null, JSON.stringify({ count: settings.length })]
      );

      res.json({ message: "Pengaturan berhasil diupdate secara bulk" });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update pengaturan secara bulk" });
  }
};

// Reset setting to default
export const resetSetting = async (req, res) => {
  try {
    const { key } = req.params;

    // Define default values for common settings
    const defaults = {
      'store_name': 'My E-commerce Store',
      'store_currency': 'IDR',
      'tax_rate': '10',
      'low_stock_threshold': '5',
      'allow_guest_checkout': 'false',
      'maintenance_mode': 'false'
    };

    const defaultValue = defaults[key];
    if (!defaultValue) {
      return res.status(400).json({ message: "Default value tidak tersedia untuk pengaturan ini" });
    }

    // Update to default
    await pool.query(
      "UPDATE settings SET value = ?, updated_at = NOW() WHERE key_name = ?",
      [defaultValue, key]
    );

    // Log activity
    await pool.query(
      "INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, 'reset_setting', 'setting', null, JSON.stringify({ key, value: defaultValue })]
    );

    res.json({ message: "Pengaturan berhasil direset ke default" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal reset pengaturan" });
  }
};

// Get public store settings
export const getStoreSettings = async (req, res) => {
  try {
    const [settings] = await pool.query(`
      SELECT key_name, value, type
      FROM settings
      WHERE is_public = TRUE
      AND category = 'store'
    `);

    // Convert to object
    const storeSettings = settings.reduce((acc, setting) => {
      let value = setting.value;
      switch (setting.type) {
        case 'boolean':
          value = value === 'true';
          break;
        case 'number':
          value = parseFloat(value);
          break;
        case 'json':
          try {
            value = JSON.parse(value);
          } catch (e) {
            value = null;
          }
          break;
      }
      acc[setting.key_name] = value;
      return acc;
    }, {});

    res.json(storeSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil pengaturan toko" });
  }
};

// Get settings audit logs
export const getSettingsAuditLogs = async (req, res) => {
  try {
    const [logs] = await pool.query(`
      SELECT
        al.*,
        u.name as user_name,
        s.key_name as setting_key
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      LEFT JOIN settings s ON al.resource_id = s.id AND al.resource_type = 'setting'
      WHERE al.resource_type IN ('setting', 'settings')
      ORDER BY al.created_at DESC
      LIMIT 100
    `);

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil log audit pengaturan" });
  }
};
