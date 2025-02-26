import Contact from '../db/models/contacts.js';

export const getContacts = async (userId) => {
  return await Contact.find({ userId });
};

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found',
        data: null,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact found',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      data: null,
    });
  }
};

export const createContact = async ({
  name,
  phoneNumber,
  email,
  isFavourite,
  contactType,
  userId,
}) => {
  const contact = await Contact.create({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
    userId,
  });
  await contact.save();
  return contact;
};

export const updateContact = async (id, data, userId) => {
  return await Contact.findOneAndUpdate({ _id: id, userId }, data, {
    new: true,
  });
};

export const deleteContact = async (id, userId) => {
  return await Contact.findOneAndDelete({ _id: id, userId });
};

export const countAllContacts = async (userId) => {
  return await Contact.countDocuments({ userId });
};
