import setupServer from './server.js';

import dotenv from 'dotenv';
import { initMongoDB } from './db/initMongoConnection.js';

dotenv.config();

(async () => {
  await initMongoDB();
  setupServer();
})();
