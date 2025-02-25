import Joi from 'joi';

export const contactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  phoneNumber: Joi.string().min(3).max(20).optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().min(3).max(20).optional(),
}).or('name', 'phoneNumber', 'email', 'isFavourite', 'contactType');
