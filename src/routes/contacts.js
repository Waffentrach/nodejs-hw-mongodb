import express from 'express';
import {
  getContacts,
  getContactById,
  createNewContact,
  updateContact,
  deleteContact,
} from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));

router.get('/:contactId', ctrlWrapper(getContactById));

router.post('/', ctrlWrapper(createNewContact));

router.patch('/:contactId', ctrlWrapper(updateContact));

router.delete('/:contactId', ctrlWrapper(deleteContact));

export default router;
