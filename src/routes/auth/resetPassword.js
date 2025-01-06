import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { validateBody } from '../../middlewares/validation.js';
import User from '../../db/models/User.js';
import Session from '../../db/models/Session.js';

const router = express.Router();

router.post(
  '/reset-pwd',
  validateBody({ token: 'string', password: 'string' }),
  async (req, res, next) => {
    try {
      const { token, password } = req.body;

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        console.error(error);
        throw createHttpError(401, 'Token is expired or invalid.');
      }

      const { email } = decoded;

      const user = await User.findOne({ email });
      if (!user) {
        throw createHttpError(404, 'User not found!');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      await user.save();

      await Session.deleteMany({ userId: user._id });

      res.status(200).json({
        status: 200,
        message: 'Password has been successfully reset.',
        data: {},
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
