"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideModule = void 0;
// Router
const router_1 = require("./router");
// Serice
const ride_service_1 = require("./ride.service");
// Controller
const ride_controller_1 = require("./ride.controller");
// Repository
const ride_respository_implementation_1 = require("../repository/implementation/ride.respository.implementation");
// Http client
const axios_client_1 = require("../common/clients/axios.client");
class RideModule {
    prismaCliente;
    constructor(prismaCliente) {
        this.prismaCliente = prismaCliente;
    }
    start(app) {
        const rideRepositoryImplementantion = new ride_respository_implementation_1.RideRepositoryImplementantion(axios_client_1.axiosClient, this.prismaCliente);
        const rideService = new ride_service_1.RideService(rideRepositoryImplementantion);
        const rideController = new ride_controller_1.RideController(rideService);
        const raceRouter = new router_1.RaceRouter(app, rideController);
        raceRouter.execute();
    }
}
exports.RideModule = RideModule;
