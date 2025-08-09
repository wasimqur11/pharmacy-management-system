import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { UserRole } from '../types';
import { 
  addDoctorSchema, 
  addEmployeeSchema, 
  addPartnerSchema,
  pharmacyConfigSchema,
  updateUserSchema
} from '../middleware/adminValidation';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

// User Management Routes
router.post('/doctors', validate(addDoctorSchema), AdminController.addDoctor);
router.post('/employees', validate(addEmployeeSchema), AdminController.addEmployee);
router.post('/partners', validate(addPartnerSchema), AdminController.addPartner);

// Get users by role
router.get('/users/:role', AdminController.getUsersByRole);

// Update user
router.put('/users/:userId', validate(updateUserSchema), AdminController.updateUser);

// Deactivate user
router.patch('/users/:userId/deactivate', AdminController.deactivateUser);

// Activate user
router.patch('/users/:userId/activate', AdminController.activateUser);

// Pharmacy Configuration Routes
router.post('/config/pharmacy', validate(pharmacyConfigSchema), AdminController.updatePharmacyConfig);
router.put('/config/pharmacy', validate(pharmacyConfigSchema), AdminController.updatePharmacyConfig);
router.get('/config/pharmacy', AdminController.getPharmacyConfig);

export default router;