import Contact from '../db/models/contacts.js';

export async function getAllContacts() {
  const contacts = await Contact.find();
  return contacts;
}

export async function getContactById(contactId) {
  const contact = await Contact.findById(contactId);
  return contact;
}

export const createContact = async ({
  name,
  phoneNumber,
  email,
  isFavourite,
  contactType,
}) => {
  const contact = new Contact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });
  await contact.save();
  return contact;
};

export const updateContactById = async (contactId, updateFields) => {
  const contact = await Contact.findByIdAndUpdate(contactId, updateFields, {
    new: true,
  });

  return contact;
};

export const deleteContactById = async (contactId) => {
  const result = await Contact.findByIdAndDelete(contactId);
  return result;
};
