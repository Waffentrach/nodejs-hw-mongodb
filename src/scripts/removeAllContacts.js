import { writeContacts } from '../utils/writeContacts.js';

export const removeAllContacts = async () => {
  const emptyContacts = [];

  await writeContacts(emptyContacts);

  console.log('All contacts have been removed!');
};
