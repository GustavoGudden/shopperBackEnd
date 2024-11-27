// Dto
import { Driver, Race, User } from '@prisma/client';
import { EstimateRideDTO } from '../ride/dto/getEstimate.dto';

//  Type
import { ApiResponse } from '../ride/types/api.response';
import { CofirmRaceDTO } from '../ride/dto/confirmRace.dto';

export abstract class RideRepository {
  abstract fetchDistance(getEstimateDto: EstimateRideDTO): Promise<ApiResponse>;

  abstract getDrivesByMinDistance(distance: number): Promise<Driver[]>;

  abstract getOneById(id: number): Promise<Driver | null>;

  abstract getUserById(id: number): Promise<User | null>;

  abstract createRace(confirmRide: CofirmRaceDTO, raceValue: string): Promise<any>;

  abstract getRacesByCustomerId(filter: { customerId: number; driverId?: number }): Promise<Race[]>;
}
