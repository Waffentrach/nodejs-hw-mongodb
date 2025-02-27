import Contact from '../db/models/contacts.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  filter = {},
  sort = {},
}) => {
  const limit = Number(perPage);
  const skip = (Number(page) - 1) * limit;

  const totalContactsCount = await Contact.countDocuments(filter);

  const contacts = await Contact.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .collation({ locale: 'en', strength: 2 })
    .exec();

  const totalPages = Math.ceil(totalContactsCount / limit);

  return {
    data: contacts,
    page: Number(page),
    perPage: limit,
    totalItems: totalContactsCount,
    totalPages: totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
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
