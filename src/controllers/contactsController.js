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
  try {
    const contacts = await getAllContacts();
    return res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
});

export const getContactById = ctrlWrapper(async (req, res) => {
  try {
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
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({
        status: 404,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
});

export const createNewContact = ctrlWrapper(async (req, res) => {
  try {
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
  } catch (err) {
    if (err.status === 400) {
      return res.status(400).json({
        status: 400,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
});

export const updateContact = ctrlWrapper(async (req, res) => {
  try {
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
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({
        status: 404,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  try {
    const { contactId } = req.params;

    const deletedContact = await deleteContactById(contactId);

    if (!deletedContact) {
      throw httpErrors(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({
        status: 404,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
});
