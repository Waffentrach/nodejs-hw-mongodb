import express from 'express';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/auth.js';
import sendResetEmail from './auth/sendResetEmail.js';

import resetPassword from './auth/resetPassword.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshUserSession);
router.post('/logout', logoutUser);
router.use(sendResetEmail);
router.use(resetPassword);
export default router;
