import { Driver, Race, User } from '@prisma/client';
import { EstimateRideDTO } from './dto/getEstimate.dto';
import { IResponseDistance } from './types/api.response';
import { convertMetersToKm } from '../common/ultils/convertMetersToKm';
import { CofirmRaceDTO } from './dto/confirmRace.dto';
import { RideRepository } from '../repository/ride.repository';
import { BadRequestException } from '../common/exceptions/badRequestException';
import { NotFoundException } from '../common/exceptions/notFoundException';

export class RideService {
  constructor(private readonly rideRepository: RideRepository) {}

  async getEstimate(estimate: EstimateRideDTO): Promise<any> {
    const user = await this.getUserById(parseInt(estimate.customer_id));
    if (!user) throw new NotFoundException('CUSTOMER_NOT_FOUND', 'Enter a valid user to continue the operation.');
    return (await this.rideRepository.fetchDistance(estimate)).routes[0];
  }

  async getAvaliableDrivesWithTax(estimate: IResponseDistance) {
    const { polyline, distanceMeters, duration } = estimate;

    const KmDistance = convertMetersToKm(distanceMeters);

    const avaliableDrives = await this.rideRepository.getDrivesByMinDistance(KmDistance);

    return avaliableDrives.map((drive: Driver) => {
      return {
        id: drive.id,
        name: drive.name,
        description: drive.description,
        vehicle: drive.car,
        review: {
          rating: drive.avaliation,
          comment: drive.description,
        },
        value: this.CalculatePrice(drive.tax, distanceMeters),
      };
    });
  }

  async getDriverById(Id: number): Promise<Driver | null> {
    return await this.rideRepository.getOneById(Id);
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.rideRepository.getUserById(id);
  }

  async confirmRace(confirmRide: CofirmRaceDTO): Promise<any> {
    const getDriver = await this.getDriverById(confirmRide.driver.id);

    if (!getDriver) throw new NotFoundException('DRIVER_NOT_FOUND', 'Inform a valid driver to continue the operation.');
    if (getDriver?.minKm > convertMetersToKm(confirmRide.distance))
      throw new BadRequestException('INVALID_DISTANCE', 'The selected distance does not meet the drivers minimum requirements');

    const saveRide = await this.rideRepository.createRace(confirmRide, this.CalculatePrice(getDriver.tax, confirmRide.distance));

    return {
      success: true,
    };
  }

  async getClientRaces(filter: { customerId: number; driverId?: number }): Promise<any> {
    if (filter.driverId) {
      const driver = await this.getDriverById(filter.driverId);
      if (!driver) throw new BadRequestException('INVALID_DRIVER', 'Informe um motorista valido para continuar a operação.');
    }
    const response = await this.rideRepository.getRacesByCustomerId(filter);

    if (response.length === 0) throw new NotFoundException('NO_RIDES_FOUND', 'No rides were found.');

    const format = await Promise.all(
      response.map(async (ride: Race) => {
        const driver = await this.getDriverById(ride.driverId);
        return {
          ...ride,
          driver: {
            id: driver?.id,
            name: driver?.name,
          },
        };
      })
    );

    return {
      customer_id: filter.customerId,
      rides: format,
    };
  }

  private CalculatePrice(taxPerDrive: number, distanceMeters: number) {
    const KmDistance = convertMetersToKm(distanceMeters);
    if (taxPerDrive < 0 || distanceMeters < 0) {
      throw new Error('Taxa ou distância não podem ser negativas');
    }
    const price = taxPerDrive * KmDistance;
    return price.toFixed(2);
  }
}
