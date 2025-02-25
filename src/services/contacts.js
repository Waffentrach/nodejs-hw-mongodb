import Contact from '../db/models/contacts.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  name,
  isFavourite,
  contactType,
}) => {
  const limit = Number(perPage);
  const skip = (Number(page) - 1) * limit;

  const query = {};

  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }

  if (typeof isFavourite !== 'undefined') {
    query.isFavourite = isFavourite === 'true';
  }

  if (contactType) {
    query.contactType = contactType;
  }

  const totalContactsCount = await Contact.countDocuments(query);

  const contacts = await Contact.find(query).skip(skip).limit(limit).exec();

  return {
    data: contacts,
    total: totalContactsCount,
    page: Number(page),
    perPage: Number(perPage),
  };
};

export const countAllContacts = async () => {
  return Contact.countDocuments();
};
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
