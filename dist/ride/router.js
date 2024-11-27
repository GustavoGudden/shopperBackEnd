"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaceRouter = void 0;
const express_1 = require("express");
const validateDto_middleware_1 = require("../common/middleware/validateDto.middleware");
const getEstimate_dto_1 = require("./dto/getEstimate.dto");
const confirmRace_dto_1 = require("./dto/confirmRace.dto");
// Controller
class RaceRouter {
    expressApp;
    rideController;
    productRouter = (0, express_1.Router)();
    constructor(expressApp, rideController) {
        this.expressApp = expressApp;
        this.rideController = rideController;
    }
    async execute() {
        // Post
        this.productRouter.post('/estimate', (0, validateDto_middleware_1.validateDTO)(getEstimate_dto_1.EstimateRideDTO), this.rideController.handlegetEstimate);
        // Patch
        this.productRouter.patch('/confirm', (0, validateDto_middleware_1.validateDTO)(confirmRace_dto_1.CofirmRaceDTO), this.rideController.handleConfirmRide);
        // Get
        this.productRouter.get('/:customer_id', this.rideController.handleGetRaces);
        this.expressApp.use('/ride', this.productRouter);
    }
}
exports.RaceRouter = RaceRouter;
