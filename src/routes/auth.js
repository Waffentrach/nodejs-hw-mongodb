import express from 'express';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/auth.js';
import {
  sendResetPasswordEmail,
  resetUserPassword,
} from '../controllers/passwordController.js';
import { validateBody } from '../middlewares/validation.js';
import {
  registerValidationSchema,
  loginValidationSchema,
  resetPasswordSchema,
} from '../middlewares/validationSchemas.js';

const router = express.Router();

router.post('/register', validateBody(registerValidationSchema), registerUser);
router.post('/login', validateBody(loginValidationSchema), loginUser);
router.post('/refresh', refreshUserSession);
router.post('/logout', logoutUser);

router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  sendResetPasswordEmail,
);
router.post(
  '/reset-password/confirm',
  validateBody(resetPasswordSchema),
  resetUserPassword,
);

export default router;
