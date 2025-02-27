import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .required(),
  email: Joi.string().email().required(),
  isFavourite: Joi.boolean().required(),
  contactType: Joi.string().valid('personal', 'business').required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(30).optional(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('personal', 'business').optional(),
}).or('name', 'phoneNumber', 'email', 'isFavourite', 'contactType'); // Має містити хоча б одне поле для оновлення
