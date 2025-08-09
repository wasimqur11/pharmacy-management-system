import sqlite3 from 'sqlite3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = path.join(__dirname, '../pharmacy_management.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ SQLite connection error:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Promisify database methods for async/await usage
export const dbRun = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err: Error | null) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const dbGet = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err: Error | null, row: any) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err: Error | null, rows: any[]) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize database with schema
export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Initializing database schema...');
    
    // Enable foreign keys
    await dbRun('PRAGMA foreign_keys = ON');
    
    // Create users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'pharmacist', 'admin', 'partner')),
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create patients table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        date_of_birth DATE,
        address TEXT,
        emergency_contact TEXT,
        medical_history TEXT
      )
    `);
    
    // Create doctors table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        specialization TEXT NOT NULL,
        license_number TEXT UNIQUE NOT NULL,
        consultation_fee REAL NOT NULL,
        is_available BOOLEAN DEFAULT 1
      )
    `);
    
    // Create staff table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        employee_id TEXT UNIQUE NOT NULL,
        department TEXT NOT NULL,
        salary REAL NOT NULL,
        hire_date DATE NOT NULL
      )
    `);
    
    // Create partners table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS partners (
        id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        profit_share_percentage REAL NOT NULL CHECK (profit_share_percentage >= 0 AND profit_share_percentage <= 100),
        investment_amount REAL NOT NULL,
        join_date DATE NOT NULL
      )
    `);
    
    // Create products table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        description TEXT,
        sku TEXT UNIQUE NOT NULL,
        barcode TEXT,
        category TEXT NOT NULL,
        manufacturer TEXT NOT NULL,
        batch_number TEXT,
        expiry_date DATE,
        cost_price REAL NOT NULL,
        selling_price REAL NOT NULL,
        stock_quantity INTEGER NOT NULL DEFAULT 0,
        min_stock_level INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert default admin user
    const adminExists = await dbGet('SELECT id FROM users WHERE email = ?', ['admin@pharmacy.com']);
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password', 10);
      
      await dbRun(
        'INSERT INTO users (id, email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin-id-123', 'admin@pharmacy.com', hashedPassword, 'Admin', 'User', 'admin']
      );
      
      console.log('✅ Default admin user created: admin@pharmacy.com / password');
    }
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Closing database connection...');
  db.close((err?: Error | null) => {
    if (err) {
      console.error(err.message);
    }
    console.log('✅ Database connection closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🔄 Closing database connection...');
  db.close((err?: Error | null) => {
    if (err) {
      console.error(err.message);
    }
    console.log('✅ Database connection closed');
    process.exit(0);
  });
});