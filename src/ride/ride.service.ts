import { Driver, Race } from '@prisma/client';
import { EstimateRideDTO } from './dto/getEstimate.dto';
import { RideRepositoryImplementantion } from './repository/implementation/ride.respository.implementation';
import { IResponseDistance } from './types/api.response';
import { convertMetersToKm } from '../common/ultils/convertMetersToKm';
import { CofirmRaceDTO } from './dto/confirmRace.dto';
import { HttpResponse } from './types/httpResponse';

export class RideService {
  constructor(private readonly rideRepositoryImplementantion: RideRepositoryImplementantion) {}

  async getEstimate(estimate: EstimateRideDTO): Promise<any> {
    return (await this.rideRepositoryImplementantion.fetchDistance(estimate)).routes[0];
  }

  async getAvaliableDrivesWithTax(estimate: IResponseDistance) {
    const { polyline, distanceMeters, duration } = estimate;

    const KmDistance = convertMetersToKm(distanceMeters);

    const avaliableDrives = await this.rideRepositoryImplementantion.getDrivesByMinDistance(KmDistance);

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
    return await this.rideRepositoryImplementantion.getOneById(Id);
  }

  async confirmRace(confirmRide: CofirmRaceDTO): Promise<any> {
    if (JSON.stringify(confirmRide.origin) === JSON.stringify(confirmRide.destination)) {
      return {
        status: 400,
        error_code: 'INVALID_DATA',
        error_description: 'O local de origem não pode ser o mesmo que o destino. Por favor, verifique as informações e tente novamente.',
      };
    }
    const getDriver = await this.getDriverById(confirmRide.driver.id);

    if (!getDriver) {
      return {
        status: 404,
        error_code: 'DRIVER_NOT_FOUND',
        error_description: 'Informe um motorista valido para continuar a operação.',
      };
    }

    if (getDriver?.minKm > convertMetersToKm(confirmRide.distance)) {
      return {
        status: 404,
        error_code: 'INVALID_DISTANCE',
        error_description: 'The selected distance does not meet the drivers minimum requirements',
      };
    }

    const saveRide = await this.rideRepositoryImplementantion.CreateRace(confirmRide, this.CalculatePrice(getDriver.tax, confirmRide.distance));

    return {
      success: true,
    };
  }

  async getClientRaces(filter: { customerId: number; driverId?: number }): Promise<any> {
    if (filter.driverId) {
      const driver = await this.getDriverById(filter.driverId);
      if (!driver) {
        return {
          error_code: 'INVALID_DRIVER',
          error_description: 'Informe um motorista valido para continuar a operação.',
        };
      }
    }
    const response = await this.rideRepositoryImplementantion.getRacesByCustomerId(filter);

    if (response.length === 0) {
      return {
        error_description: 'NO_RIDES_FOUND',
        error_code: 'No rides were found.',
      };
    }

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
