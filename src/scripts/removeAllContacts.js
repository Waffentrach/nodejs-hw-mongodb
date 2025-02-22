import { writeContacts } from '../utils/writeContacts.js';
export async function removeAllContacts() {
  try {
    await writeContacts([]);
    console.log('All contacts removed');
  } catch (error) {
    console.error('Error removing all contacts:', error);
  }
}

removeAllContacts();
