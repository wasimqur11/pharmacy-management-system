import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRequest, loginSchema, registerSchema } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);

// Protected routes
router.get('/profile', authenticate, AuthController.getProfile);

export default router;