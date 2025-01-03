import express from 'express';
import {
  getContacts,
  getContactById,
  createNewContact,
  updateContact,
  deleteContact,
} from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validation.js';
import { contactValidationSchema } from '../middlewares/validationSchemas.js';
import { isValidId } from '../middlewares/isValidId.js';
const router = express.Router();

router.get('/', ctrlWrapper(getContacts));

router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post(
  '/',
  validateBody(contactValidationSchema),
  ctrlWrapper(createNewContact),
);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(contactValidationSchema),
  ctrlWrapper(updateContact),
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
