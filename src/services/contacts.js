import Contact from '../db/models/contacts.js';

export const getAllContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  filter = {},
  sort = { name: 'asc' },
}) => {
  const limit = Number(perPage);
  const skip = (Number(page) - 1) * limit;

  const fullFilter = { ...filter, userId };

  const totalContactsCount = await Contact.countDocuments(fullFilter);

  const contacts = await Contact.find(fullFilter)
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

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
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

export const updateContactById = async (contactId, updateFields, userId) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateFields,
    { new: true },
  );
  return contact;
};

export const deleteContactById = async (contactId, userId) => {
  const result = await Contact.findOneAndDelete({ _id: contactId, userId });
  return result;
};

export const countAllContacts = async (userId) => {
  return await Contact.countDocuments({ userId });
};
