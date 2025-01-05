import { createFakeContact } from '../utils/createFakeContact.js';
import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';

export const generateContacts = async (count) => {
  const existingContacts = await readContacts();

  const newContacts = [];
  for (let i = 0; i < count; i++) {
    newContacts.push(createFakeContact());
  }

  const allContacts = [...existingContacts, ...newContacts];
  await writeContacts(allContacts);

  console.log(`Successfully added ${count} new contacts!`);
};
