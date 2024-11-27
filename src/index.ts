import 'reflect-metadata';
import { connectToPrisma, getPrismaClient } from './common/clients/prisma.client';
import { AppModule } from './app/app.module';

import dotenv from 'dotenv';
dotenv.config();

function bootstrap() {
  const prismaClient = getPrismaClient();

  connectToPrisma(prismaClient).then(() => {
    new AppModule({
      port: 3001,
      ormClient: prismaClient,
    });
  });
}

bootstrap();
