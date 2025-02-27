import {
  getAllContacts,
  getContactById as fetchContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';
import HttpErrors from 'http-errors';

export const getContacts = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    name,
    isFavourite,
    contactType,
  } = req.query;

  const pageNumber = parseInt(page, 10) || 1;
  const itemsPerPage = parseInt(perPage, 10) || 10;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const filter = {};

  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }

  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  if (contactType) {
    filter.contactType = contactType;
  }

  const contacts = await getAllContacts({
    page: pageNumber,
    perPage: itemsPerPage,
    filter,
    sort: { [sortBy]: sortDirection },
  });

  const { data, totalItems, totalPages, hasPreviousPage, hasNextPage } =
    contacts;

  return res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data,
      page: pageNumber,
      perPage: itemsPerPage,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await fetchContactById(contactId);

  if (!contact) {
    throw HttpErrors(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createNewContact = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  const newContact = await createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  if (!newContact) {
    throw HttpErrors(400, 'Failed to create contact');
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const updatedData = req.body;

  const updatedContact = await updateContactById(contactId, updatedData);

  if (!updatedContact) {
    throw HttpErrors(404, `Contact with id ${contactId} not found`);
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated contact!',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;

  const deletedContact = await deleteContactById(contactId);

  if (!deletedContact) {
    throw HttpErrors(404, `Contact with id ${contactId} not found`);
  }

  res.status(204).send();
};
