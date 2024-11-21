import { Express } from 'express';
import { PrismaClient } from '@prisma/client';

// Router
import { RaceRouter } from './router';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';

// Controller

// Service

// Repository

export class rideModule {
  constructor(private readonly prismaClient: PrismaClient) {}

  start(app: Express) {
    // const rideRespository = new RideRepository(this.prismaClient);

    const rideService = new RideService();
    const rideController = new RideController(rideService);
    const raceRouter = new RaceRouter(app, rideController);

    raceRouter.execute();
  }
}
