import express, { Express } from 'express';
import { Server } from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';

// Orm Dependencies
import { PrismaClient } from '@prisma/client';
import { disconnectFromPrisma } from '../common/clients/prisma.client';

// Modules
import { RideModule } from '../ride/ride.module';

export interface ApplicationOptions {
  port: number;
  ormClient: PrismaClient;
}

export class AppModule {
  app!: Express;
  server!: Server;
  prismaClient!: PrismaClient;

  constructor(appOptions: ApplicationOptions) {
    this.app = express();
    this.prismaClient = appOptions.ormClient;

    this.startServer(appOptions.port);
  }

  async startServer(port: number) {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors({ origin: '*' }));

    this.loadApplicationModules();

    this.server = this.app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });

    process.on('beforeExit', async () => {
      await this.closeServer();
    });
  }

  async closeServer() {
    await disconnectFromPrisma(this.prismaClient);
    this.server.close();
  }

  loadApplicationModules() {
    new RideModule(this.prismaClient).start(this.app);
  }
}
