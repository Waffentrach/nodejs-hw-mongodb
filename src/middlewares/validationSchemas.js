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
}).or('name', 'phoneNumber', 'email', 'isFavourite', 'contactType');
