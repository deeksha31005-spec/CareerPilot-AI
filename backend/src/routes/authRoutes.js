import express from 'express';

import {
  registerUser,
  loginUser,
  getUserProfile
} from '../controllers/authController.js';

import {
  forgotPassword,
  resetPassword
} from '../controllers/passwordController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/me', protect, getUserProfile);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

export default router;