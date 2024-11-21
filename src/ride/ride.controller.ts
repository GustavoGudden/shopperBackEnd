import { Request, Response } from 'express';
import { RideService } from './ride.service';

// Services

export class RideController {
  constructor(private readonly rideService: RideService) {}

  handleGetAllProducts = async (req: Request, res: Response) => {};
}
