import { NextFunction, Request, Response } from 'express';

// Services
import { RideService } from './ride.service';
import { strict } from 'assert';

export class RideController {
  constructor(private readonly rideService: RideService) {}

  async handlegetEstimate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { origin, customer_id, destination } = req.body;

    const estimate = await this.rideService.getEstimate(req.body);

    const AvaliableDrives = await this.rideService.getAvaliableDrivesWithTax(estimate);

    res
      .json({
        origin: {
          latitude: origin.latitude,
          longitude: origin.longitude,
        },
        destination: {
          latitude: destination.latitude,
          longitude: origin.longitude,
        },
        distance: estimate.distanceMeters,
        duration: estimate.duration,
        options: AvaliableDrives,
      })
      .status(200);
  }

  async handleConfirmRide(req: Request, res: Response, next: NextFunction): Promise<void> {
    const result = await this.rideService.confirmRace(req.body);
    console.log(result);
    res.json(result).status(result.status ? result.status : 200);
  }

  async handleGetRaces(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { customer_id } = req.params;
    const driver_id = req.query.driver_id;

    if (driver_id && typeof driver_id === 'string') {
      const races = await this.rideService.getClientRaces({ customerId: parseInt(customer_id), driverId: parseInt(driver_id) });
      res.json(races).status(200);
      return;
    }

    const races = await this.rideService.getClientRaces({ customerId: parseInt(customer_id) });
    res.json(races).status(200);
  }
}
