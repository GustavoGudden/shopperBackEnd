"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const ride_respository_implementation_1 = require("../repository/implementation/ride.respository.implementation");
const ride_controller_1 = require("./ride.controller");
const ride_service_1 = require("./ride.service");
const prisma_client_1 = require("../common/clients/prisma.client");
const axios_client_1 = require("../common/clients/axios.client");
const ride_module_1 = require("./ride.module");
const app_module_1 = require("../app/app.module");
describe('RideController', () => {
    let rideModule;
    let rideController;
    let rideService;
    let rideRepositoryImplementantion;
    let appModule;
    beforeAll(async () => {
        const prismaClient = (0, prisma_client_1.getPrismaClient)();
        const axios = axios_client_1.axiosClient;
        await (0, prisma_client_1.connectToPrisma)(prismaClient);
        appModule = new app_module_1.AppModule({
            port: 3001,
            ormClient: prismaClient,
        });
        rideModule = new ride_module_1.RideModule(prismaClient);
        rideRepositoryImplementantion = new ride_respository_implementation_1.RideRepositoryImplementantion(axios, prismaClient);
        rideService = new ride_service_1.RideService(rideRepositoryImplementantion);
        rideController = new ride_controller_1.RideController(rideService);
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
        const response = await (0, supertest_1.default)(appModule.app)
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
    // it('should create a ride', async () => {
    //   const driverMock = {
    //     id: 2,
    //     name: 'carlos',
    //     description: 'bom motorista mas acelera muito',
    //     car: 'honda',
    //     avaliation: 3,
    //     tax: 1.98,
    //     minKm: 10,
    //   };
    //   const sucessMessage = {
    //     sucesso: true,
    //   };
    //   const CreateRaceMock = {
    //     id: 28,
    //     driverId: 2,
    //     userID: 2,
    //     originAdress: 'a',
    //     destinationAdress: 'a',
    //     date: new Date(),
    //     origin: '-23.55052 -46.633308',
    //     destination: '-24.55052 -46.633308',
    //     value: 882.58,
    //   };
    //   jest.spyOn(rideService, 'getDriverById').mockResolvedValue(driverMock);
    //   jest.spyOn(rideRepositoryImplementantion, 'createRace').mockResolvedValue(CreateRaceMock);
    //   const response = await request(appModule.app)
    //     .patch('/ride/confirm')
    //     .send({
    //       customer_id: 2,
    //       origin: {
    //         latitude: -23.55052,
    //         longitude: -46.633308,
    //       },
    //       destination: {
    //         latitude: -24.55052,
    //         longitude: -46.633308,
    //       },
    //       distance: 445746,
    //       duration: '21331s',
    //       value: '588.38',
    //       driver: {
    //         id: 2,
    //         name: 'carlos',
    //       },
    //     });
    //   expect(response.status).toBe(201);
    //   expect(response.body).toEqual(sucessMessage);
    // });
    // it('should get rides by id', async () => {
    //   const races = [
    //     {
    //       id: 28,
    //       driverId: 2,
    //       userID: 2,
    //       originAdress: 'a',
    //       destinationAdress: 'a',
    //       date: new Date(),
    //       origin: '-23.55052 -46.633308',
    //       destination: '-24.55052 -46.633308',
    //       value: 882.58,
    //       driver: [Object],
    //     },
    //   ];
    //   const finalMock = {
    //     customer_id: 2,
    //     rides: [
    //       {
    //         id: 2,
    //         driverId: 1,
    //         userID: 2,
    //         originAdress: 'Endereço desconhecido',
    //         destinationAdress: 'Endereço desconhecido',
    //         date: '2024-11-22T22:15:27.826Z',
    //         origin: '-23.55052 -46.633308',
    //         destination: '-22.906847 -46.633308',
    //         value: 588.38,
    //         driver: {
    //           id: 1,
    //           name: 'josh',
    //         },
    //       },
    //     ],
    //   };
    //   jest.spyOn(rideService, 'getClientRaces').mockResolvedValue(races);
    //   jest.spyOn(rideRepositoryImplementantion, 'getRacesByCustomerId').mockResolvedValue(races);
    //   const response = await request(appModule.app).get('/ride/2');
    //   expect(response.status).toBe(200);
    //   expect(response.body).toEqual(finalMock);
    // });
});
