import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'reflect-metadata';

// Prisma Client
import { connectToPrisma, disconnectFromPrisma, getPrismaClient } from './common/clients/prisma.client';
import { rideModule } from './ride/ride.module';
import dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors({ origin: '*' }));

  const prismaClient = getPrismaClient();

  await connectToPrisma(prismaClient);

  new rideModule(prismaClient).start(app);

  app.listen(3000, () => {
    console.log(`Example app listening on port 3000`);
  });
  process.on('beforeExit', async () => {
    await disconnectFromPrisma(prismaClient);
  });
}

bootstrap();
