import { readContacts } from '../utils/readContacts.js';

export const getAllContacts = async () => {
  const contacts = await readContacts();
  console.log('All contacts:', contacts);
  return contacts;
};
