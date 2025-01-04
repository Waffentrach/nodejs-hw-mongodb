import Contact from '../db/models/contacts.js';

export const getContacts = async (userId) => {
  return await Contact.find({ userId });
};

export const getContactById = async (id, userId) => {
  return await Contact.findOne({ _id: id, userId });
};

export const createContact = async ({
  name,
  phoneNumber,
  email,
  isFavourite,
  contactType,
  userId,
}) => {
  const contact = new Contact({
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
