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
  createContactSchema,
  updateContactSchema,
} from '../middlewares/validationSchemas.js';

import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';
import { uploadPhoto } from '../utils/cloudinary.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(async (req, res) => {
    const { name, email, phoneNumber, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let photo = '';
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
      try {
        photo = await uploadPhoto(req.file.path);
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Failed to upload image to Cloudinary' });
      }
    }

    try {
      const newContact = await createNewContact({
        name,
        email,
        phoneNumber,
        contactType,
        photo,
      });

      return res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
      });
    } catch (error) {
      console.error('Error creating contact:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }),
);

router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(async (req, res) => {
    const { name, email, phoneNumber } = req.body;
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
      { name, email, phoneNumber, ...(photo && { photo }) },
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

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
