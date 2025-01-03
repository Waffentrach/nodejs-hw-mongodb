import {
  getAllContacts,
  getContactById as fetchContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';
import httpErrors from 'http-errors';
import ctrlWrapper from '../utils/ctrlWrapper.js';

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

  try {
    const contacts = await getAllContacts();
    console.log(contacts);

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

    return res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: sortedContacts,
        page: pageNumber,
        perPage: itemsPerPage,
        totalItems,
        totalPages,
        hasPreviousPage: pageNumber > 1,
        hasNextPage: pageNumber < totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
});

export const getContactById = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await fetchContactById(contactId);

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
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw httpErrors(400, 'Missing required fields');
  }

  const newContact = await createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
});

export const updateContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const updatedData = req.body;

  const updatedContact = await updateContactById(contactId, updatedData);

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

  const deletedContact = await deleteContactById(contactId);

  if (!deletedContact) {
    throw httpErrors(404, 'Contact not found');
  }

  res.status(204).send();
});
