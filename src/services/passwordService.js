import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../db/models/User.js';
import { sendEmail } from './emailService.js';

const { RESET_SECRET, RESET_TOKEN_EXPIRATION = '1h', CLIENT_URL } = process.env;

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');

  const resetToken = jwt.sign({ id: user._id }, RESET_SECRET, {
    expiresIn: RESET_TOKEN_EXPIRATION,
  });

  const resetLink = `${CLIENT_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    text: `To reset your password, follow this link: ${resetLink}`,
  });

  return { message: 'Reset password email sent' };
};

export const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, RESET_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw createHttpError(404, 'User not found');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: 'Password reset successful' };
  } catch (error) {
    throw createHttpError(400, 'Invalid or expired reset token');
  }
};
