import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';

// Prisma Client
import { connectToPrisma, disconnectFromPrisma, getPrismaClient } from './common/clients/prismaClient';

async function bootstrap() {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors({ origin: '*' }));

  const prismaClient = getPrismaClient();
  await connectToPrisma(prismaClient);

  app.listen(3000, () => {
    console.log(`Example app listening on port 3000`);
  });
  process.on('beforeExit', async () => {
    await disconnectFromPrisma(prismaClient);
  });
}

bootstrap();
