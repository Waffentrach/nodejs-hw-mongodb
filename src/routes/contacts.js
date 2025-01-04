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
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/', authenticate, ctrlWrapper(getContacts));

router.get('/:contactId', isValidId, authenticate, ctrlWrapper(getContactById));

router.post(
  '/',
  validateBody(contactValidationSchema),
  authenticate,
  ctrlWrapper(createNewContact),
);

router.patch(
  '/:contactId',
  isValidId,
  authenticate,
  validateBody(contactValidationSchema),
  ctrlWrapper(updateContact),
);

router.delete(
  '/:contactId',
  isValidId,
  authenticate,
  ctrlWrapper(deleteContact),
);

export default router;
