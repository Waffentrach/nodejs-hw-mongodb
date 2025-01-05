import { createFakeContact } from '../utils/createFakeContact.js';
import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';

export const addOneContact = async () => {
  const existingContacts = await readContacts();

  const newContact = createFakeContact();

  existingContacts.push(newContact);

  await writeContacts(existingContacts);

  console.log('Successfully added a new contact!');
};
