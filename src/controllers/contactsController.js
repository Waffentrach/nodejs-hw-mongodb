import {
  getAllContacts as fetchAllContacts,
  getContactById as fetchContactById,
  createContact,
  updateContactById as updateContactService,
  deleteContactById as deleteContactService,
} from '../services/contacts.js';
import httpErrors from 'http-errors';

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

  const userId = req.user._id;
  const filter = { userId };

  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }

  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  if (contactType) {
    filter.contactType = contactType;
  }

  const contacts = await fetchAllContacts({
    page: pageNumber,
    perPage: itemsPerPage,
    filter,
    sort: { [sortBy]: sortDirection },
  });

  const { data, totalItems, totalPages, hasPreviousPage, hasNextPage } =
    contacts;

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      contacts: data,
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
};

export const createNewContact = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const userId = req.user._id;

  const newContact = await createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
    userId,
  });

  if (!newContact) {
    throw httpErrors(400, 'Failed to create contact');
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
  const userId = req.user._id;

  const updatedContact = await updateContactService(
    contactId,
    updatedData,
    userId,
  );

  if (!updatedContact) {
    throw httpErrors(404, `Contact with id ${contactId} not found`);
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated contact!',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const deletedContact = await deleteContactService(contactId, userId);

  if (!deletedContact) {
    throw httpErrors(404, `Contact with id ${contactId} not found`);
  }

  res.status(204).send();
};
