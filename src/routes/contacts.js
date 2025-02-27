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
import {
  updateContactSchema,
  createContactSchema,
} from '../middlewares/validationSchemas.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authenticate, ctrlWrapper(getContacts));

router.get('/:contactId', isValidId, authenticate, ctrlWrapper(getContactById));

router.post(
  '/',
  validateBody(createContactSchema),
  authenticate,
  ctrlWrapper(createNewContact),
);

router.patch(
  '/:contactId',
  isValidId,
  authenticate,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact),
);

router.delete(
  '/:contactId',
  isValidId,
  authenticate,
  ctrlWrapper(deleteContact),
);

export default router;
