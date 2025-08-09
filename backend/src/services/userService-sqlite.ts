import { dbRun, dbGet, dbAll } from '../../config/database-sqlite';
import { User, UserRole } from '../types';
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
    try {
      // Check if user already exists
      const existingUser = await dbGet(
        'SELECT id FROM users WHERE email = ?',
        [userData.email]
      );
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Hash password
      const passwordHash = await hashPassword(userData.password);
      
      // Generate ID
      const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create base user
      await dbRun(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, userData.email, passwordHash, userData.firstName, userData.lastName, userData.phone, userData.role, 1]
      );
      
      // Create role-specific record
      switch (userData.role) {
        case UserRole.PATIENT:
          await dbRun('INSERT INTO patients (id) VALUES (?)', [userId]);
          break;
        case UserRole.DOCTOR:
          await dbRun(
            'INSERT INTO doctors (id, specialization, license_number, consultation_fee) VALUES (?, ?, ?, ?)',
            [userId, 'General Medicine', `MD${Date.now()}`, 500.00]
          );
          break;
        case UserRole.PHARMACIST:
          await dbRun(
            'INSERT INTO staff (id, employee_id, department, salary, hire_date) VALUES (?, ?, ?, ?, ?)',
            [userId, `EMP${Date.now()}`, 'Pharmacy', 25000.00, new Date().toISOString().split('T')[0]]
          );
          break;
        case UserRole.PARTNER:
          await dbRun(
            'INSERT INTO partners (id, profit_share_percentage, investment_amount, join_date) VALUES (?, ?, ?, ?)',
            [userId, 10.00, 50000.00, new Date().toISOString().split('T')[0]]
          );
          break;
      }
      
      const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
      
      return {
        id: user.id,
        email: user.email,
        password: user.password_hash,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role as UserRole,
        isActive: user.is_active === 1,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at)
      };
    } catch (error) {
      throw error;
    }
  }
  
  static async authenticateUser(email: string, password: string): Promise<AuthResponse> {
    const user = await dbGet(
      'SELECT * FROM users WHERE email = ? AND is_active = 1',
      [email]
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
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
      role: user.role as UserRole,
      isActive: user.is_active === 1,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at)
    };
    
    const token = generateToken(userObject);
    
    const { password: _, ...userWithoutPassword } = userObject;
    
    return {
      user: userWithoutPassword,
      token
    };
  }
  
  static async getUserById(id: string): Promise<User | null> {
    const user = await dbGet(
      'SELECT * FROM users WHERE id = ? AND is_active = 1',
      [id]
    );
    
    if (!user) {
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
      password: user.password_hash,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role as UserRole,
      isActive: user.is_active === 1,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at)
    };
  }
}