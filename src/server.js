import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import YAML from 'yamljs';
import path from 'path';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function setupServer() {
  const app = express();
  const swaggerDocument = YAML.load(
    path.join(__dirname, '../docs/openapi.yaml'),
  );

  app.use(cookieParser());
  app.use(express.json());
  app.use(cors());
  app.use(pino());

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default setupServer;
