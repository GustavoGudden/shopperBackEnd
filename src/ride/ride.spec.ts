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
          duration: '23438s',
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

    const finalMock = {
      origin: {
        latitude: -23.55052,
        longitude: -46.633308,
      },
      destination: {
        latitude: -22.906847,
        longitude: -46.633308,
      },
      distance: 445746,
      duration: '23438s',
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
        customer_id: 2,
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
    expect(response.body).toEqual(finalMock);
  });

  it('should create a ride', async () => {
    const driverMock = {
      id: 2,
      name: 'carlos',
      description: 'bom motorista mas acelera muito',
      car: 'honda',
      avaliation: 3,
      tax: 1.98,
      minKm: 10,
    };
    const sucessMessage = {
      sucesso: true,
    };
    const CreateRaceMock = {
      id: 28,
      driverId: 2,
      userID: 2,
      originAdress: 'a',
      destinationAdress: 'a',
      date: new Date(),
      origin: '-23.55052 -46.633308',
      destination: '-24.55052 -46.633308',
      value: 882.58,
    };

    jest.spyOn(rideService, 'getDriverById').mockResolvedValue(driverMock);
    jest.spyOn(rideRepositoryImplementantion, 'createRace').mockResolvedValue(CreateRaceMock);

    const response = await request(appModule.app)
      .patch('/ride/confirm')
      .send({
        customer_id: 2,
        origin: {
          latitude: -23.55052,
          longitude: -46.633308,
        },
        destination: {
          latitude: -24.55052,
          longitude: -46.633308,
        },
        distance: 445746,
        duration: '21331s',
        value: '588.38',
        driver: {
          id: 2,
          name: 'carlos',
        },
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(sucessMessage);
  });

  it('should get rides by id', async () => {
    const races = [
      {
        id: 28,
        driverId: 2,
        userID: 2,
        originAdress: 'a',
        destinationAdress: 'a',
        date: new Date(),
        origin: '-23.55052 -46.633308',
        destination: '-24.55052 -46.633308',
        value: 882.58,
        driver: [Object],
      },
    ];
    const finalMock = {
      customer_id: 2,
      rides: [
        {
          id: 2,
          driverId: 1,
          userID: 2,
          originAdress: 'Endereço desconhecido',
          destinationAdress: 'Endereço desconhecido',
          date: '2024-11-22T22:15:27.826Z',
          origin: '-23.55052 -46.633308',
          destination: '-22.906847 -46.633308',
          value: 588.38,
          driver: {
            id: 1,
            name: 'josh',
          },
        },
      ],
    };
    jest.spyOn(rideService, 'getClientRaces').mockResolvedValue(races);
    jest.spyOn(rideRepositoryImplementantion, 'getRacesByCustomerId').mockResolvedValue(races);
    const response = await request(appModule.app).get('/ride/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(finalMock);
  });
});
