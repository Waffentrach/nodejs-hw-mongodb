import express from 'express';
import {
  getContacts,
  getContactById,
} from '../controllers/contactsController.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getContacts);
contactsRouter.get('/:contactId', getContactById);

export default contactsRouter;
