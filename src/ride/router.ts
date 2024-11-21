import { Express, Router } from 'express';
import { RideController } from './ride.controller';

// Controller

export class RaceRouter {
  private productRouter = Router();

  constructor(private readonly expressApp: Express, private readonly rideController: RideController) {}

  async execute() {
    // Post
    this.productRouter.post('/estimate');

    // Patch
    this.productRouter.patch('/confirm');

    // Get
    this.productRouter.get('/ride/{customer_id}?driver_id={id do motorista}');

    this.expressApp.use('/ride', this.productRouter);
  }
}
