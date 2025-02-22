import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';

export async function removeLastContact() {
  try {
    const contacts = await readContacts();
    if (contacts.length > 0) {
      const lastContact = contacts.pop();
      await writeContacts(contacts);
      console.log('Last contact removed:', lastContact);
    } else {
      console.log('No contacts to remove');
    }
  } catch (error) {
    console.error('Error removing last contact:', error);
  }
}

removeLastContact();
