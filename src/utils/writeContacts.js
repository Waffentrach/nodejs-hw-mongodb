import fs from 'fs/promises';
import { PATH_DB } from '../constants/contacts.js';

export const writeContacts = async (contacts) => {
  try {
    const data = JSON.stringify(contacts, null, 2);
    await fs.writeFile(PATH_DB, data);
  } catch (error) {
    console.error('Error writing contacts:', error);
  }
};
