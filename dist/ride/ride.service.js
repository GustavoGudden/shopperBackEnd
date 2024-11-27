"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const convertMetersToKm_1 = require("../common/ultils/convertMetersToKm");
const badRequestException_1 = require("../common/exceptions/badRequestException");
const notFoundException_1 = require("../common/exceptions/notFoundException");
class RideService {
    rideRepository;
    constructor(rideRepository) {
        this.rideRepository = rideRepository;
    }
    async getEstimate(estimate) {
        const user = await this.getUserById(parseInt(estimate.customer_id));
        if (!user)
            throw new notFoundException_1.NotFoundException('CUSTOMER_NOT_FOUND', 'Enter a valid user to continue the operation.');
        return (await this.rideRepository.fetchDistance(estimate)).routes[0];
    }
    async getAvaliableDrivesWithTax(estimate) {
        const { polyline, distanceMeters, duration } = estimate;
        const KmDistance = (0, convertMetersToKm_1.convertMetersToKm)(distanceMeters);
        const avaliableDrives = await this.rideRepository.getDrivesByMinDistance(KmDistance);
        return avaliableDrives.map((drive) => {
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
    async getDriverById(Id) {
        return await this.rideRepository.getOneById(Id);
    }
    async getUserById(id) {
        return await this.rideRepository.getUserById(id);
    }
    async confirmRace(confirmRide) {
        const getDriver = await this.getDriverById(confirmRide.driver.id);
        if (!getDriver)
            throw new notFoundException_1.NotFoundException('DRIVER_NOT_FOUND', 'Inform a valid driver to continue the operation.');
        if (getDriver?.minKm > (0, convertMetersToKm_1.convertMetersToKm)(confirmRide.distance))
            throw new badRequestException_1.BadRequestException('INVALID_DISTANCE', 'The selected distance does not meet the drivers minimum requirements');
        const saveRide = await this.rideRepository.createRace(confirmRide, this.CalculatePrice(getDriver.tax, confirmRide.distance));
        return {
            success: true,
        };
    }
    async getClientRaces(filter) {
        if (filter.driverId) {
            const driver = await this.getDriverById(filter.driverId);
            if (!driver)
                throw new badRequestException_1.BadRequestException('INVALID_DRIVER', 'Informe um motorista valido para continuar a operação.');
        }
        const response = await this.rideRepository.getRacesByCustomerId(filter);
        if (response.length === 0)
            throw new notFoundException_1.NotFoundException('NO_RIDES_FOUND', 'No rides were found.');
        const format = await Promise.all(response.map(async (ride) => {
            const driver = await this.getDriverById(ride.driverId);
            return {
                ...ride,
                driver: {
                    id: driver?.id,
                    name: driver?.name,
                },
            };
        }));
        return {
            customer_id: filter.customerId,
            rides: format,
        };
    }
    CalculatePrice(taxPerDrive, distanceMeters) {
        const KmDistance = (0, convertMetersToKm_1.convertMetersToKm)(distanceMeters);
        if (taxPerDrive < 0 || distanceMeters < 0) {
            throw new Error('Taxa ou distância não podem ser negativas');
        }
        const price = taxPerDrive * KmDistance;
        return price.toFixed(2);
    }
}
exports.RideService = RideService;
