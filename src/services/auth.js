import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../db/models/User.js';
import Session from '../db/models/Session.js';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error(
    'Error: JWT_SECRET or JWT_REFRESH_SECRET is not defined in .env file',
  );
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined in .env');
}
export const registerService = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();
  return newUser;
};

export const loginService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await Session.findOneAndDelete({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' },
  );

  const session = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  await session.save();

  return { accessToken, refreshToken };
};

export const refreshService = async (oldRefreshToken) => {
  let decoded;

  try {
    decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    console.error(error);
    throw createHttpError(401, 'Invalid refresh token');
  }

  const existingSession = await Session.findOne({
    refreshToken: oldRefreshToken,
  });
  if (!existingSession) {
    throw createHttpError(401, 'Session not found');
  }

  await Session.findByIdAndDelete(existingSession._id);

  const newAccessToken = jwt.sign(
    { userId: decoded.userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );
  const newRefreshToken = jwt.sign(
    { userId: decoded.userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' },
  );

  const newSession = new Session({
    userId: decoded.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  await newSession.save();

  return { accessToken: newAccessToken, newRefreshToken };
};

export const logoutService = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  await Session.findByIdAndDelete(session._id);
};
