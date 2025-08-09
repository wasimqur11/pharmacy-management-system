import Joi from 'joi';
import { UserRole } from '../types';

export const addDoctorSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name must not exceed 50 characters',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name must not exceed 50 characters',
    'any.required': 'Last name is required'
  }),
  phone: Joi.string().pattern(/^\+?[\d\s\-()]+$/).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  }),
  specialization: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Specialization must be at least 2 characters long',
    'any.required': 'Specialization is required'
  }),
  licenseNumber: Joi.string().min(3).max(50).required().messages({
    'string.min': 'License number must be at least 3 characters long',
    'any.required': 'License number is required'
  }),
  consultationFee: Joi.number().positive().required().messages({
    'number.positive': 'Consultation fee must be a positive number',
    'any.required': 'Consultation fee is required'
  })
});

export const addEmployeeSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name must not exceed 50 characters',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name must not exceed 50 characters',
    'any.required': 'Last name is required'
  }),
  phone: Joi.string().pattern(/^\+?[\d\s\-()]+$/).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  }),
  employeeId: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Employee ID must be at least 3 characters long',
    'any.required': 'Employee ID is required'
  }),
  department: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Department must be at least 2 characters long',
    'any.required': 'Department is required'
  }),
  salary: Joi.number().positive().required().messages({
    'number.positive': 'Salary must be a positive number',
    'any.required': 'Salary is required'
  })
});

export const addPartnerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name must not exceed 50 characters',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name must not exceed 50 characters',
    'any.required': 'Last name is required'
  }),
  phone: Joi.string().pattern(/^\+?[\d\s\-()]+$/).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  }),
  profitSharePercentage: Joi.number().min(0.01).max(100).required().messages({
    'number.min': 'Profit share must be at least 0.01%',
    'number.max': 'Profit share cannot exceed 100%',
    'any.required': 'Profit share percentage is required'
  }),
  investmentAmount: Joi.number().positive().required().messages({
    'number.positive': 'Investment amount must be a positive number',
    'any.required': 'Investment amount is required'
  })
});

export const pharmacyConfigSchema = Joi.object({
  pharmacyName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Pharmacy name must be at least 2 characters long',
    'any.required': 'Pharmacy name is required'
  }),
  address: Joi.string().min(10).max(500).required().messages({
    'string.min': 'Address must be at least 10 characters long',
    'any.required': 'Address is required'
  }),
  phone: Joi.string().pattern(/^\+?[\d\s\-()]+$/).required().messages({
    'string.pattern.base': 'Please provide a valid phone number',
    'any.required': 'Phone number is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  licenseNumber: Joi.string().min(5).max(50).required().messages({
    'string.min': 'License number must be at least 5 characters long',
    'any.required': 'License number is required'
  }),
  registrationNumber: Joi.string().min(5).max(50).required().messages({
    'string.min': 'Registration number must be at least 5 characters long',
    'any.required': 'Registration number is required'
  }),
  ownerName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Owner name must be at least 2 characters long',
    'any.required': 'Owner name is required'
  }),
  workingHours: Joi.object({
    monday: Joi.object({
      open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      closed: Joi.boolean().optional()
    }).required(),
    tuesday: Joi.object({
      open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      closed: Joi.boolean().optional()
    }).required(),
    wednesday: Joi.object({
      open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      closed: Joi.boolean().optional()
    }).required(),
    thursday: Joi.object({
      open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      closed: Joi.boolean().optional()
    }).required(),
    friday: Joi.object({
      open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      closed: Joi.boolean().optional()
    }).required(),
    saturday: Joi.object({
      open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      closed: Joi.boolean().optional()
    }).required(),
    sunday: Joi.object({
      open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      closed: Joi.boolean().optional()
    }).required()
  }).required(),
  currency: Joi.string().length(3).uppercase().required().messages({
    'string.length': 'Currency must be a 3-letter code (e.g., INR, USD)',
    'any.required': 'Currency is required'
  }),
  taxRate: Joi.number().min(0).max(50).required().messages({
    'number.min': 'Tax rate cannot be negative',
    'number.max': 'Tax rate cannot exceed 50%',
    'any.required': 'Tax rate is required'
  })
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().pattern(/^\+?[\d\s\-()]+$/).optional(),
  specialization: Joi.string().min(2).max(100).optional(),
  consultationFee: Joi.number().positive().optional(),
  department: Joi.string().min(2).max(50).optional(),
  salary: Joi.number().positive().optional(),
  profitSharePercentage: Joi.number().min(0.01).max(100).optional(),
  investmentAmount: Joi.number().positive().optional()
});