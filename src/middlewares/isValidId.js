import mongoose from 'mongoose';
import httpErrors from 'http-errors';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(httpErrors(400, 'Invalid ID format'));
  }
  next();
};
