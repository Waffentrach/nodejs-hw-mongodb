import {
  getContacts as fetchContacts,
  getContactById as fetchContactById,
  createContact,
  updateContact as updateContactService,
  deleteContact as deleteContactService,
} from '../services/contacts.js';
import { cloudinary } from '../utils/cloudinary.js';
import httpErrors from 'http-errors';
import ctrlWrapper from '../utils/ctrlWrapper.js';

import dotenv from 'dotenv';
dotenv.config();
console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

export const getContacts = ctrlWrapper(async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
  } = req.query;

  const pageNumber = parseInt(page, 10);
  const itemsPerPage = parseInt(perPage, 10);
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const userId = req.user._id;

  const contacts = await fetchContacts(userId);

  if (!Array.isArray(contacts)) {
    throw new Error('Contacts data is not an array.');
  }

  const totalItems = contacts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const sortedContacts = contacts
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortDirection * -1;
      if (a[sortBy] > b[sortBy]) return sortDirection;
      return 0;
    })
    .slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      contacts: sortedContacts,
      page: pageNumber,
      perPage: itemsPerPage,
      totalItems,
      totalPages,
      hasPreviousPage: pageNumber > 1,
      hasNextPage: pageNumber < totalPages,
    },
  });
});

export const getContactById = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await fetchContactById(contactId, userId);

  if (!contact) {
    throw httpErrors(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
});

export const createNewContact = ctrlWrapper(async (req, res) => {
  const { name, phoneNumber, email, contactType } = req.body || {};
  const { file } = req;

  if (!name || !phoneNumber || !contactType) {
    throw httpErrors(
      400,
      'Missing required fields: name, phoneNumber, or contactType',
    );
  }

  const userId = req.user._id;

  let imageUrl = null;

  if (file) {
    try {
      const uploadResult = await cloudinary.v2.uploader.upload(file.path);
      imageUrl = uploadResult.secure_url;
    } catch (error) {
      throw httpErrors(500, 'Failed to upload image to Cloudinary');
    }
  }

  const newContact = await createContact({
    name,
    phoneNumber,
    email,
    contactType,
    userId,
    imageUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
});

export const updateContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const updatedData = req.body || {};
  const { file } = req;
  const userId = req.user._id;

  let imageUrl = updatedData.imageUrl;

  if (file) {
    try {
      const uploadResult = await cloudinary.v2.uploader.upload(file.path);
      imageUrl = uploadResult.secure_url;
    } catch (error) {
      throw httpErrors(500, 'Failed to upload image to Cloudinary');
    }
  }

  const updatedContact = await updateContactService(
    contactId,
    {
      ...updatedData,
      imageUrl,
    },
    userId,
  );

  if (!updatedContact) {
    throw httpErrors(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated contact!',
    data: updatedContact,
  });
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const deletedContact = await deleteContactService(contactId, userId);

  if (!deletedContact) {
    throw httpErrors(404, 'Contact not found');
  }

  res.status(204).send();
});
