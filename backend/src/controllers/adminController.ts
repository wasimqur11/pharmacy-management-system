import { Response } from 'express';
import { AdminService } from '../services/adminService';
import { ApiResponse, UserRole } from '../types';
import { AuthRequest } from '../middleware/auth';

export class AdminController {
  // Add Doctor
  static async addDoctor(req: AuthRequest, res: Response): Promise<void> {
    try {
      const doctorData = req.body;
      const doctor = await AdminService.addDoctor(doctorData);
      
      const response: ApiResponse<typeof doctor> = {
        success: true,
        message: 'Doctor added successfully',
        data: doctor
      };
      
      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to add doctor',
        error: error.message
      };
      
      res.status(400).json(response);
    }
  }

  // Add Employee/Staff
  static async addEmployee(req: AuthRequest, res: Response): Promise<void> {
    try {
      const employeeData = req.body;
      const employee = await AdminService.addEmployee(employeeData);
      
      const response: ApiResponse<typeof employee> = {
        success: true,
        message: 'Employee added successfully',
        data: employee
      };
      
      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to add employee',
        error: error.message
      };
      
      res.status(400).json(response);
    }
  }

  // Add Partner
  static async addPartner(req: AuthRequest, res: Response): Promise<void> {
    try {
      const partnerData = req.body;
      const partner = await AdminService.addPartner(partnerData);
      
      const response: ApiResponse<typeof partner> = {
        success: true,
        message: 'Partner added successfully',
        data: partner
      };
      
      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to add partner',
        error: error.message
      };
      
      res.status(400).json(response);
    }
  }

  // Get All Users by Role
  static async getUsersByRole(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { role } = req.params;
      const users = await AdminService.getUsersByRole(role as UserRole);
      
      const response: ApiResponse<typeof users> = {
        success: true,
        message: `${role}s retrieved successfully`,
        data: users
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve users',
        error: error.message
      };
      
      res.status(500).json(response);
    }
  }

  // Update User
  static async updateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const userData = req.body;
      const updatedUser = await AdminService.updateUser(userId, userData);
      
      const response: ApiResponse<typeof updatedUser> = {
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to update user',
        error: error.message
      };
      
      res.status(400).json(response);
    }
  }

  // Deactivate User
  static async deactivateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      await AdminService.deactivateUser(userId);
      
      const response: ApiResponse<null> = {
        success: true,
        message: 'User deactivated successfully'
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to deactivate user',
        error: error.message
      };
      
      res.status(400).json(response);
    }
  }

  // Activate User
  static async activateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      await AdminService.activateUser(userId);
      
      const response: ApiResponse<null> = {
        success: true,
        message: 'User activated successfully'
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to activate user',
        error: error.message
      };
      
      res.status(400).json(response);
    }
  }

  // Pharmacy Configuration
  static async updatePharmacyConfig(req: AuthRequest, res: Response): Promise<void> {
    try {
      const configData = req.body;
      const config = await AdminService.updatePharmacyConfig(configData);
      
      const response: ApiResponse<typeof config> = {
        success: true,
        message: 'Pharmacy configuration updated successfully',
        data: config
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to update pharmacy configuration',
        error: error.message
      };
      
      res.status(400).json(response);
    }
  }

  // Get Pharmacy Configuration
  static async getPharmacyConfig(req: AuthRequest, res: Response): Promise<void> {
    try {
      const config = await AdminService.getPharmacyConfig();
      
      const response: ApiResponse<typeof config> = {
        success: true,
        message: 'Pharmacy configuration retrieved successfully',
        data: config
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve pharmacy configuration',
        error: error.message
      };
      
      res.status(500).json(response);
    }
  }
}