// Client
import { Driver, PrismaClient, Race } from '@prisma/client';

// abstract- contract
import { RideRepository } from '../ride.repository';

// Dto
import { EstimateRideDTO } from '../../dto/getEstimate.dto';
import { CofirmRaceDTO } from '../../dto/confirmRace.dto';

// Type
import { ApiResponse } from '../../types/api.response';

// Axios instance
import { AxiosInstance } from 'axios';

export class RideRepositoryImplementantion extends RideRepository {
  constructor(private readonly axiosInstance: AxiosInstance, private readonly prismaClient: PrismaClient) {
    super();
  }

  async fetchDistance(getEstimateDto: EstimateRideDTO): Promise<ApiResponse> {
    const { customer_id, destination, origin } = getEstimateDto;

    try {
      // return (
      //   await this.axiosInstance.post(`/directions/v2:computeRoutes?key=${process.env.GOOGLE_API_KEY}`, {
      //     origin: {
      //       location: {
      //         latLng: {
      //           latitude: origin.latitude,
      //           longitude: origin.longitude,
      //         },
      //       },
      //     },
      //     destination: {
      //       location: {
      //         latLng: {
      //           latitude: destination.latitude,
      //           longitude: destination.longitude,
      //         },
      //       },
      //     },
      //     travelMode: 'DRIVE',
      //     routingPreference: 'TRAFFIC_AWARE',
      //     computeAlternativeRoutes: false,
      //     routeModifiers: {
      //       avoidTolls: false,
      //       avoidHighways: false,
      //       avoidFerries: false,
      //     },
      //     languageCode: 'en-US',
      //     units: 'IMPERIAL',
      //   })
      // ).data;

      return {
        routes: [
          {
            distanceMeters: 445746,
            duration: '21331s',
            polyline: {
              encodedPolyline: 'ipkcFhichV|QBJuEAYXwM{E?',
            },
          },
        ],
      };
    } catch (getDistance) {
      throw new Error('Não foi possível calcular a estimativa de rota. Verifique os dados fornecidos.');
    }
  }

  async getDrivesByMinDistance(distance: number): Promise<Driver[]> {
    try {
      return await this.prismaClient.driver.findMany({
        where: {
          minKm: {
            lte: distance,
          },
        },
      });
    } catch (getDrivesBydistance) {
      throw new Error('Não foi possível calcular a estimativa de rota. Verifique os dados fornecidos.');
    }
  }

  async getOneById(id: number): Promise<Driver | null> {
    try {
      return await this.prismaClient.driver.findUnique({
        where: {
          id,
        },
      });
    } catch (getOneDriver) {
      throw new Error('Não foi possível calcular a estimativa de rota. Verifique os dados fornecidos.');
    }
  }

  async CreateRace(confirmRide: CofirmRaceDTO, raceValue: string): Promise<any> {
    try {
      return await this.prismaClient.race.create({
        data: {
          origin: `${confirmRide.origin.latitude} ${confirmRide.origin.longitude}`,
          date: new Date(),
          destination: `${confirmRide.destination.latitude} ${confirmRide.destination.longitude}`,
          value: parseFloat(raceValue),
          driverId: confirmRide.driver.id,
          userID: confirmRide.customer_id,
        },
      });
    } catch (createRace) {
      throw new Error('Não foi possível calcular a estimativa de rota. Verifique os dados fornecidos.');
    }
  }

  async getRacesByCustomerId(filter: { customerId: number; driverId?: number }): Promise<Race[]> {
    const { customerId, driverId } = filter;

    try {
      return await this.prismaClient.race.findMany({
        where: {
          userID: customerId,
          ...(driverId && { driverId }),
        },
      });
    } catch (getRace) {
      throw new Error('Nao foi possivel buscar suas corridas');
    }
  }
}
