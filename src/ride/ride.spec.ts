import request from 'supertest';

import { RideRepositoryImplementantion } from '../repository/implementation/ride.respository.implementation';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { connectToPrisma, getPrismaClient } from '../common/clients/prisma.client';
import { axiosClient } from '../common/clients/axios.client';
import { RideModule } from './ride.module';
import { AppModule } from '../app/app.module';

describe('RideController', () => {
  let rideModule: RideModule;
  let rideController: RideController;
  let rideService: RideService;
  let rideRepositoryImplementantion: RideRepositoryImplementantion;
  let appModule: AppModule;

  beforeAll(async () => {
    const prismaClient = getPrismaClient();
    const axios = axiosClient;

    await connectToPrisma(prismaClient);

    appModule = new AppModule({
      port: 3001,
      ormClient: prismaClient,
    });
    rideModule = new RideModule(prismaClient);
    rideRepositoryImplementantion = new RideRepositoryImplementantion(axios, prismaClient);
    rideService = new RideService(rideRepositoryImplementantion);
    rideController = new RideController(rideService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await appModule.closeServer();
  });

  it('should return the ride estimate', async () => {
    const responseApiMock = {
      routes: [
        {
          distanceMeters: 774,
          duration: '156s',
          polyline: {
            encodedPolyline: 'ipkcFhichV|QBJuEAYXwM{E?',
          },
        },
      ],
    };

    const formatedMock = [
      {
        id: 1,
        name: 'josh',
        description: 'a',
        vehicle: 'civic',
        review: {
          rating: 5,
          comment: 'a',
        },
        value: '588.38',
      },
      {
        id: 2,
        name: 'carlos',
        description: 'bom motorista mas acelera muito',
        vehicle: 'honda',
        review: {
          rating: 3,
          comment: 'bom motorista mas acelera muito',
        },
        value: '882.58',
      },
    ];

    const finalMoc = {
      origin: {
        latitude: -23.55052,
        longitude: -46.633308,
      },
      destination: {
        latitude: -22.906847,
        longitude: -46.633308,
      },
      distance: 445746,
      duration: '21331s',
      options: [
        {
          id: 1,
          name: 'josh',
          description: 'a',
          vehicle: 'civic',
          review: {
            rating: 5,
            comment: 'a',
          },
          value: '588.38',
        },
        {
          id: 2,
          name: 'carlos',
          description: 'bom motorista mas acelera muito',
          vehicle: 'honda',
          review: {
            rating: 3,
            comment: 'bom motorista mas acelera muito',
          },
          value: '882.58',
        },
      ],
    };

    jest.spyOn(rideRepositoryImplementantion, 'fetchDistance').mockResolvedValue(responseApiMock);
    jest.spyOn(rideService, 'getAvaliableDrivesWithTax').mockResolvedValue(formatedMock);

    const response = await request(appModule.app)
      .post('/ride/estimate')
      .send({
        customer_id: 1,
        origin: {
          latitude: -23.55052,
          longitude: -46.633308,
        },
        destination: {
          latitude: -22.906847,
          longitude: -43.172896,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(finalMoc);
  });
});
