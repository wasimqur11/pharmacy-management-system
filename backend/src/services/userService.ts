import { pool } from '../../config/database';
import { User, UserRole, Patient, Doctor, Staff, Partner } from '../types';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export class UserService {
  static async createUser(userData: CreateUserRequest): Promise<User> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [userData.email]
      );
      
      if (existingUser.rows.length > 0) {
        throw new Error('User with this email already exists');
      }
      
      // Hash password
      const passwordHash = await hashPassword(userData.password);
      
      // Create base user
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userData.email, passwordHash, userData.firstName, userData.lastName, userData.phone, userData.role, true]
      );
      
      const user = userResult.rows[0];
      
      // Create role-specific record
      switch (userData.role) {
        case UserRole.PATIENT:
          await client.query(
            'INSERT INTO patients (id) VALUES ($1)',
            [user.id]
          );
          break;
        case UserRole.DOCTOR:
          // For now, we'll set default values. In a real app, this would come from the request
          await client.query(
            'INSERT INTO doctors (id, specialization, license_number, consultation_fee) VALUES ($1, $2, $3, $4)',
            [user.id, 'General Medicine', `MD${Date.now()}`, 500.00]
          );
          break;
        case UserRole.PHARMACIST:
          await client.query(
            'INSERT INTO staff (id, employee_id, department, salary, hire_date) VALUES ($1, $2, $3, $4, $5)',
            [user.id, `EMP${Date.now()}`, 'Pharmacy', 25000.00, new Date()]
          );
          break;
        case UserRole.PARTNER:
          await client.query(
            'INSERT INTO partners (id, profit_share_percentage, investment_amount, join_date) VALUES ($1, $2, $3, $4)',
            [user.id, 10.00, 50000.00, new Date()]
          );
          break;
      }
      
      await client.query('COMMIT');
      
      return {
        id: user.id,
        email: user.email,
        password: user.password_hash,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  static async authenticateUser(email: string, password: string): Promise<AuthResponse> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }
    
    const user = result.rows[0];
    
    const isValidPassword = await comparePassword(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }
    
    const userObject: User = {
      id: user.id,
      email: user.email,
      password: user.password_hash,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
    
    const token = generateToken(userObject);
    
    const { password: _, ...userWithoutPassword } = userObject;
    
    return {
      user: userWithoutPassword,
      token
    };
  }
  
  static async getUserById(id: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND is_active = true',
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    
    return {
      id: user.id,
      email: user.email,
      password: user.password_hash,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
}