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
    this.productRouter.post('/estimate', validateDTO(EstimateRideDTO), (req, res, next) => this.rideController.handlegetEstimate(req, res, next));

    // Patch
    this.productRouter.patch('/confirm', validateDTO(CofirmRaceDTO), (req, res, next) => this.rideController.handleConfirmRide(req, res, next));

    // Get
    this.productRouter.get('/:customer_id', (req, res, next) => this.rideController.handleGetRaces(req, res, next));

    this.expressApp.use('/ride', this.productRouter);
  }
}
