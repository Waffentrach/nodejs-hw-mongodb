import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';
import { createFakeContact } from '../utils/createFakeContact.js';

export async function generateContacts(count) {
  try {
    const contacts = await readContacts();
    for (let i = 0; i < count; i++) {
      contacts.push(createFakeContact());
    }
    await writeContacts(contacts);
    console.log(`${count} contacts added!`);
  } catch (error) {
    console.error('Error generating contacts:', error);
  }
}

generateContacts(5);
