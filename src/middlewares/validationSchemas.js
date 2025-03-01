import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  phoneNumber: Joi.string()
    .pattern(/^(\+380\d{9}|\d{10})$/, 'phone number')
    .min(10)
    .max(15)
    .required(),
  email: Joi.string().email().required(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
  photo: Joi.string().optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(30).optional(),
  phoneNumber: Joi.string()
    .pattern(/^(\+380\d{9}|\d{10})$/, 'phone number')
    .min(10)
    .max(15)
    .optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
  photo: Joi.string().optional(),
}).or('name', 'phoneNumber', 'email', 'isFavourite', 'contactType', 'photo');

export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const registerValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
export const resetPasswordSchema = Joi.object({
  token: Joi.string().optional(),
  email: Joi.string().email().optional(),
  newPassword: Joi.string().min(6).required(),
}).xor('token', 'email');
