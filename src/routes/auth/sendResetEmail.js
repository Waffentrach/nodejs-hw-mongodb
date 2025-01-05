import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { validateBody } from '../../middlewares/validation.js';
import User from '../../db/models/User.js';

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

router.post(
  '/send-reset-email',
  validateBody({ email: 'string' }),
  async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        throw createHttpError(404, 'User not found!');
      }

      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '5m',
      });

      const resetPasswordUrl = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${resetPasswordUrl}">here</a> to reset your password. The link is valid for 5 minutes.</p>`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        status: 200,
        message: 'Reset password email has been successfully sent.',
        data: {},
      });
    } catch (error) {
      if (error.message.includes('Failed to send the email')) {
        next(
          createHttpError(
            500,
            'Failed to send the email, please try again later.',
          ),
        );
      } else {
        next(error);
      }
    }
  },
);

export default router;
