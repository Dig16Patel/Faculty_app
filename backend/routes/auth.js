import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  register,
  login,
  getCurrentUser,
  updateProfile
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getCurrentUser);
router.put('/profile', auth, updateProfile);

export default router; 