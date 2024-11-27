import { Request, Response } from 'express';

// Services
import { RideService } from './ride.service';

export class RideController {
  constructor(private readonly rideService: RideService) {}

  handlegetEstimate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { origin, customer_id, destination } = req.body;

      const estimate = await this.rideService.getEstimate(req.body);
      console.log(estimate);

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
    } catch (exception: any) {
      const { status, ...exceptionRest } = exception;
      res.status(status || 500).json(exceptionRest);
    }
  };

  handleConfirmRide = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.rideService.confirmRace(req.body);
      res.status(201).json(result);
    } catch (exception: any) {
      const { status, ...exceptionRest } = exception;
      res.status(status || 500).json(exceptionRest);
    }
  };

  handleGetRaces = async (req: Request, res: Response): Promise<void> => {
    try {
      const { customer_id } = req.params;
      const driver_id = req.query.driver_id;

      if (driver_id && typeof driver_id === 'string') {
        const races = await this.rideService.getClientRaces({ customerId: parseInt(customer_id), driverId: parseInt(driver_id) });
        res.json(races).status(200);
        return;
      }
      const races = await this.rideService.getClientRaces({ customerId: parseInt(customer_id) });
      res.json(races).status(200);
    } catch (exception: any) {
      const { status, ...exceptionRest } = exception;
      res.status(status || 500).json(exceptionRest);
    }
  };
}
