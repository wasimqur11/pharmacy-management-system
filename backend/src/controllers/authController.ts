import { Request, Response } from 'express';
import { UserService, CreateUserRequest } from '../services/userService-sqlite';
import { ApiResponse } from '../types';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserRequest = req.body;
      
      const user = await UserService.createUser(userData);
      const authResponse = await UserService.authenticateUser(userData.email, userData.password);
      
      const response: ApiResponse<typeof authResponse> = {
        success: true,
        message: 'User registered successfully',
        data: authResponse
      };
      
      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Registration failed',
        error: error.message
      };
      
      res.status(400).json(response);
    }
  }
  
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      const authResponse = await UserService.authenticateUser(email, password);
      
      const response: ApiResponse<typeof authResponse> = {
        success: true,
        message: 'Login successful',
        data: authResponse
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Login failed',
        error: error.message
      };
      
      res.status(401).json(response);
    }
  }
  
  static async getProfile(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const user = await UserService.getUserById(userId);
      
      if (!user) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'User not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const { password, ...userWithoutPassword } = user;
      
      const response: ApiResponse<typeof userWithoutPassword> = {
        success: true,
        message: 'Profile retrieved successfully',
        data: userWithoutPassword
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve profile',
        error: error.message
      };
      
      res.status(500).json(response);
    }
  }
}