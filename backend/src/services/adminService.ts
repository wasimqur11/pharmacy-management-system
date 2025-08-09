import { dbRun, dbGet, dbAll } from '../../config/database-sqlite';
import { User, UserRole } from '../types';
import { hashPassword } from '../utils/password';

export interface AddDoctorRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  specialization: string;
  licenseNumber: string;
  consultationFee: number;
}

export interface AddEmployeeRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  employeeId: string;
  department: string;
  salary: number;
}

export interface AddPartnerRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profitSharePercentage: number;
  investmentAmount: number;
}

export interface PharmacyConfig {
  id?: string;
  pharmacyName: string;
  address: string;
  phone: string;
  email: string;
  licenseNumber: string;
  registrationNumber: string;
  ownerName: string;
  workingHours: {
    monday: { open: string; close: string; closed?: boolean };
    tuesday: { open: string; close: string; closed?: boolean };
    wednesday: { open: string; close: string; closed?: boolean };
    thursday: { open: string; close: string; closed?: boolean };
    friday: { open: string; close: string; closed?: boolean };
    saturday: { open: string; close: string; closed?: boolean };
    sunday: { open: string; close: string; closed?: boolean };
  };
  currency: string;
  taxRate: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AdminService {
  static async addDoctor(doctorData: AddDoctorRequest): Promise<any> {
    try {
      // Check if user already exists
      const existingUser = await dbGet(
        'SELECT id FROM users WHERE email = ?',
        [doctorData.email]
      );
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Check if license number already exists
      const existingLicense = await dbGet(
        'SELECT id FROM doctors WHERE license_number = ?',
        [doctorData.licenseNumber]
      );
      
      if (existingLicense) {
        throw new Error('Doctor with this license number already exists');
      }
      
      // Hash password
      const passwordHash = await hashPassword(doctorData.password);
      
      // Generate ID
      const userId = `doctor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create user
      await dbRun(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, doctorData.email, passwordHash, doctorData.firstName, doctorData.lastName, doctorData.phone, UserRole.DOCTOR, 1]
      );
      
      // Create doctor record
      await dbRun(
        'INSERT INTO doctors (id, specialization, license_number, consultation_fee, is_available) VALUES (?, ?, ?, ?, ?)',
        [userId, doctorData.specialization, doctorData.licenseNumber, doctorData.consultationFee, 1]
      );
      
      const user = await dbGet(
        `SELECT u.*, d.specialization, d.license_number, d.consultation_fee, d.is_available
         FROM users u JOIN doctors d ON u.id = d.id WHERE u.id = ?`,
        [userId]
      );
      
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async addEmployee(employeeData: AddEmployeeRequest): Promise<any> {
    try {
      // Check if user already exists
      const existingUser = await dbGet(
        'SELECT id FROM users WHERE email = ?',
        [employeeData.email]
      );
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Check if employee ID already exists
      const existingEmpId = await dbGet(
        'SELECT id FROM staff WHERE employee_id = ?',
        [employeeData.employeeId]
      );
      
      if (existingEmpId) {
        throw new Error('Employee with this ID already exists');
      }
      
      // Hash password
      const passwordHash = await hashPassword(employeeData.password);
      
      // Generate ID
      const userId = `staff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create user
      await dbRun(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, employeeData.email, passwordHash, employeeData.firstName, employeeData.lastName, employeeData.phone, UserRole.PHARMACIST, 1]
      );
      
      // Create staff record
      await dbRun(
        'INSERT INTO staff (id, employee_id, department, salary, hire_date) VALUES (?, ?, ?, ?, ?)',
        [userId, employeeData.employeeId, employeeData.department, employeeData.salary, new Date().toISOString().split('T')[0]]
      );
      
      const user = await dbGet(
        `SELECT u.*, s.employee_id, s.department, s.salary, s.hire_date
         FROM users u JOIN staff s ON u.id = s.id WHERE u.id = ?`,
        [userId]
      );
      
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async addPartner(partnerData: AddPartnerRequest): Promise<any> {
    try {
      // Check if user already exists
      const existingUser = await dbGet(
        'SELECT id FROM users WHERE email = ?',
        [partnerData.email]
      );
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Check total profit share doesn't exceed 100%
      const totalShares = await dbGet(
        'SELECT SUM(profit_share_percentage) as total FROM partners'
      );
      
      const currentTotal = totalShares?.total || 0;
      if (currentTotal + partnerData.profitSharePercentage > 100) {
        throw new Error(`Total profit share would exceed 100%. Current total: ${currentTotal}%`);
      }
      
      // Hash password
      const passwordHash = await hashPassword(partnerData.password);
      
      // Generate ID
      const userId = `partner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create user
      await dbRun(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, partnerData.email, passwordHash, partnerData.firstName, partnerData.lastName, partnerData.phone, UserRole.PARTNER, 1]
      );
      
      // Create partner record
      await dbRun(
        'INSERT INTO partners (id, profit_share_percentage, investment_amount, join_date) VALUES (?, ?, ?, ?)',
        [userId, partnerData.profitSharePercentage, partnerData.investmentAmount, new Date().toISOString().split('T')[0]]
      );
      
      const user = await dbGet(
        `SELECT u.*, p.profit_share_percentage, p.investment_amount, p.join_date
         FROM users u JOIN partners p ON u.id = p.id WHERE u.id = ?`,
        [userId]
      );
      
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async getUsersByRole(role: UserRole): Promise<any[]> {
    let query = '';
    
    switch (role) {
      case UserRole.DOCTOR:
        query = `SELECT u.*, d.specialization, d.license_number, d.consultation_fee, d.is_available
                 FROM users u JOIN doctors d ON u.id = d.id WHERE u.role = ?`;
        break;
      case UserRole.PHARMACIST:
        query = `SELECT u.*, s.employee_id, s.department, s.salary, s.hire_date
                 FROM users u JOIN staff s ON u.id = s.id WHERE u.role = ?`;
        break;
      case UserRole.PARTNER:
        query = `SELECT u.*, p.profit_share_percentage, p.investment_amount, p.join_date
                 FROM users u JOIN partners p ON u.id = p.id WHERE u.role = ?`;
        break;
      default:
        query = 'SELECT * FROM users WHERE role = ?';
    }
    
    const users = await dbAll(query, [role]);
    return users.map(user => {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  static async updateUser(userId: string, userData: any): Promise<any> {
    try {
      // Update base user info
      await dbRun(
        'UPDATE users SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [userData.firstName, userData.lastName, userData.phone, userId]
      );

      // Update role-specific data
      const user = await dbGet('SELECT role FROM users WHERE id = ?', [userId]);
      
      if (user?.role === UserRole.DOCTOR && userData.specialization) {
        await dbRun(
          'UPDATE doctors SET specialization = ?, consultation_fee = ? WHERE id = ?',
          [userData.specialization, userData.consultationFee, userId]
        );
      } else if (user?.role === UserRole.PHARMACIST && userData.department) {
        await dbRun(
          'UPDATE staff SET department = ?, salary = ? WHERE id = ?',
          [userData.department, userData.salary, userId]
        );
      } else if (user?.role === UserRole.PARTNER && userData.profitSharePercentage) {
        await dbRun(
          'UPDATE partners SET profit_share_percentage = ?, investment_amount = ? WHERE id = ?',
          [userData.profitSharePercentage, userData.investmentAmount, userId]
        );
      }

      return await this.getUsersByRole(user.role);
    } catch (error) {
      throw error;
    }
  }

  static async deactivateUser(userId: string): Promise<void> {
    await dbRun(
      'UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );
  }

  static async activateUser(userId: string): Promise<void> {
    await dbRun(
      'UPDATE users SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );
  }

  static async updatePharmacyConfig(configData: PharmacyConfig): Promise<PharmacyConfig> {
    try {
      // Check if config exists
      const existingConfig = await dbGet('SELECT id FROM pharmacy_config LIMIT 1');
      
      const configJson = JSON.stringify(configData.workingHours);
      
      if (existingConfig) {
        // Update existing config
        await dbRun(
          `UPDATE pharmacy_config SET 
           pharmacy_name = ?, address = ?, phone = ?, email = ?, 
           license_number = ?, registration_number = ?, owner_name = ?,
           working_hours = ?, currency = ?, tax_rate = ?,
           updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [configData.pharmacyName, configData.address, configData.phone, configData.email,
           configData.licenseNumber, configData.registrationNumber, configData.ownerName,
           configJson, configData.currency, configData.taxRate, existingConfig.id]
        );
      } else {
        // Create new config
        await dbRun(
          `INSERT INTO pharmacy_config 
           (pharmacy_name, address, phone, email, license_number, registration_number, 
            owner_name, working_hours, currency, tax_rate, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [configData.pharmacyName, configData.address, configData.phone, configData.email,
           configData.licenseNumber, configData.registrationNumber, configData.ownerName,
           configJson, configData.currency, configData.taxRate]
        );
      }
      
      const updatedConfig = await this.getPharmacyConfig();
      if (!updatedConfig) {
        throw new Error('Failed to retrieve updated pharmacy configuration');
      }
      return updatedConfig;
    } catch (error) {
      throw error;
    }
  }

  static async getPharmacyConfig(): Promise<PharmacyConfig | null> {
    const config = await dbGet('SELECT * FROM pharmacy_config LIMIT 1');
    
    if (config) {
      return {
        id: config.id,
        pharmacyName: config.pharmacy_name,
        address: config.address,
        phone: config.phone,
        email: config.email,
        licenseNumber: config.license_number,
        registrationNumber: config.registration_number,
        ownerName: config.owner_name,
        workingHours: JSON.parse(config.working_hours),
        currency: config.currency,
        taxRate: config.tax_rate,
        createdAt: config.created_at,
        updatedAt: config.updated_at
      };
    }
    
    return null;
  }
}