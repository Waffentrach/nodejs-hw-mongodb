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
import { upload } from '../middlewares/upload.js';
import { uploadPhoto } from '../utils/cloudinary.js';

const router = express.Router();

router.get('/', authenticate, ctrlWrapper(getContacts));

router.get('/:contactId', isValidId, authenticate, ctrlWrapper(getContactById));

router.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateBody(contactValidationSchema),
  ctrlWrapper(async (req, res) => {
    const { name, email, phoneNumber, contactType } = req.body;
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    if (!name || !phoneNumber || !contactType) {
      console.log('Missing required fields:', {
        name,
        phoneNumber,
        contactType,
      });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (req.file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res
          .status(400)
          .json({ message: 'Invalid file type. Only JPEG, PNG allowed.' });
      }

      if (req.file.size > 5 * 1024 * 1024) {
        return res
          .status(400)
          .json({ message: 'File size exceeds the limit of 5MB.' });
      }
    }

    let photo = '';
    if (req.file) {
      try {
        photo = await uploadPhoto(req.file.path);
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Failed to upload image to Cloudinary' });
      }
    }

    const newContact = await createNewContact(
      { name, email, phoneNumber, photo },
      req,
      res,
    );
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  }),
);

router.patch(
  '/:contactId',
  isValidId,
  authenticate,
  upload.single('photo'),
  validateBody(contactValidationSchema),
  ctrlWrapper(async (req, res) => {
    const { name, email, phone } = req.body;

    let photo;
    if (req.file) {
      try {
        photo = await uploadPhoto(req.file.path);
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Failed to upload image to Cloudinary' });
      }
    }

    const updatedContact = await updateContact(
      { name, email, phone, photo },
      req,
      res,
    );
    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact!',
      data: updatedContact,
    });
  }),
);

router.delete(
  '/:contactId',
  isValidId,
  authenticate,
  ctrlWrapper(deleteContact),
);

export default router;
