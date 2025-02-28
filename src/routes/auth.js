import express from 'express';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validation.js';
import sendResetEmail from './auth/sendResetEmail.js';
import {
  registerValidationSchema,
  loginValidationSchema,
} from '../middlewares/validationSchemas.js';
import resetPassword from './auth/resetPassword.js';
const router = express.Router();

router.post('/register', validateBody(registerValidationSchema), registerUser);

router.post('/login', validateBody(loginValidationSchema), loginUser);

router.post('/refresh', refreshUserSession);

router.post('/logout', logoutUser);
router.use(sendResetEmail);
router.use(resetPassword);
export default router;
