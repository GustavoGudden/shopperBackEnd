import { Express } from 'express';
import { PrismaClient } from '@prisma/client';

// Router
import { RaceRouter } from './router';

// Serice
import { RideService } from './ride.service';

// Controller
import { RideController } from './ride.controller';

// Repository
import { RideRepositoryImplementantion } from '../repository/implementation/ride.respository.implementation';

// Http client
import { axiosClient } from '../common/clients/axios.client';

export class RideModule {
  constructor(private readonly prismaCliente: PrismaClient) {}

  start(app: Express) {
    const rideRepositoryImplementantion = new RideRepositoryImplementantion(axiosClient, this.prismaCliente);
    const rideService = new RideService(rideRepositoryImplementantion);
    const rideController = new RideController(rideService);
    const raceRouter = new RaceRouter(app, rideController);

    raceRouter.execute();
  }
}
