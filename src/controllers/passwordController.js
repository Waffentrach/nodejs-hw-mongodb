import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import User from '../db/models/User.js';
import { sendResetEmail, resetPassword } from '../services/passwordService.js';

export const sendResetPasswordEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, 'User not found');

    await sendResetEmail(user.email);
    res.status(200).json({ message: 'Reset password email sent' });
  } catch (error) {
    next(error);
  }
};

export const resetUserPassword = async (req, res, next) => {
  try {
    const { token, email, newPassword } = req.body;

    if (token) {
      const result = await resetPassword(token, newPassword);
      return res.status(200).json(result);
    }

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, 'User not found');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};
