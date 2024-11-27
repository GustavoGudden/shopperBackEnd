import { Express, Router } from 'express';
import { RideController } from './ride.controller';
import { validateDTO } from '../common/middleware/validateDto.middleware';
import { EstimateRideDTO } from './dto/getEstimate.dto';
import { CofirmRaceDTO } from './dto/confirmRace.dto';

// Controller

export class RaceRouter {
  private productRouter = Router();

  constructor(private readonly expressApp: Express, private readonly rideController: RideController) {}

  async execute() {
    // Post
    this.productRouter.post('/estimate', validateDTO(EstimateRideDTO), this.rideController.handlegetEstimate);

    // Patch
    this.productRouter.patch('/confirm', validateDTO(CofirmRaceDTO), this.rideController.handleConfirmRide);

    // Get
    this.productRouter.get('/:customer_id', this.rideController.handleGetRaces);

    this.expressApp.use('/ride', this.productRouter);
  }
}
