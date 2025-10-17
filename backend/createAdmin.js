import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Insert superadmin user
    await db.execute(
      'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Super Admin', 'admin@store.com', hashedPassword, 'superadmin']
    );

    console.log('✅ Admin user created!');
    console.log('📧 Email: admin@store.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: superadmin');

    await db.end();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAdmin();
