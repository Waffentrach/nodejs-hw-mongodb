import { readContacts } from '../utils/readContacts.js';

export async function countContacts() {
  try {
    const contacts = await readContacts();
    console.log('Total contacts:', contacts.length);
    return contacts.length;
  } catch (error) {
    console.error('Error counting contacts:', error);
  }
}

countContacts();
