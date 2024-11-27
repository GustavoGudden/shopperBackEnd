"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRepositoryImplementantion = void 0;
class RideRepositoryImplementantion {
    axiosInstance;
    prismaClient;
    constructor(axiosInstance, prismaClient) {
        this.axiosInstance = axiosInstance;
        this.prismaClient = prismaClient;
    }
    async fetchDistance(getEstimateDto) {
        const { customer_id, destination, origin } = getEstimateDto;
        try {
            return (await this.axiosInstance.post(`/directions/v2:computeRoutes?key=${process.env.GOOGLE_API_KEY}`, {
                origin: {
                    location: {
                        latLng: {
                            latitude: origin.latitude,
                            longitude: origin.longitude,
                        },
                    },
                },
                destination: {
                    location: {
                        latLng: {
                            latitude: destination.latitude,
                            longitude: destination.longitude,
                        },
                    },
                },
                travelMode: 'DRIVE',
                routingPreference: 'TRAFFIC_AWARE',
                computeAlternativeRoutes: false,
                routeModifiers: {
                    avoidTolls: false,
                    avoidHighways: false,
                    avoidFerries: false,
                },
                languageCode: 'en-US',
                units: 'IMPERIAL',
            })).data;
        }
        catch (getDistance) {
            throw new Error('The route estimate could not be calculated. Check the data provided.');
        }
    }
    async getUserById(id) {
        try {
            return await this.prismaClient.user.findUnique({
                where: {
                    id,
                },
            });
        }
        catch (getDrivesBydistance) {
            throw new Error('Could not calculate route estimate. Check the data provided.');
        }
    }
    async getDrivesByMinDistance(distance) {
        try {
            return await this.prismaClient.driver.findMany({
                where: {
                    minKm: {
                        lte: distance,
                    },
                },
            });
        }
        catch (getDrivesBydistance) {
            throw new Error('The route estimate could not be calculated. Check the data provided.');
        }
    }
    async getOneById(id) {
        try {
            return await this.prismaClient.driver.findUnique({
                where: {
                    id,
                },
            });
        }
        catch (getOneDriver) {
            throw new Error('Não foi possível calcular a estimativa de rota. Verifique os dados fornecidos.');
        }
    }
    async createRace(confirmRide, raceValue) {
        try {
            return await this.prismaClient.race.create({
                data: {
                    destinationAdress: confirmRide.destinationAdress,
                    originAdress: confirmRide.originAdress,
                    origin: `${confirmRide.origin.latitude} ${confirmRide.origin.longitude}`,
                    date: new Date(),
                    destination: `${confirmRide.destination.latitude} ${confirmRide.destination.longitude}`,
                    value: parseFloat(raceValue),
                    driverId: confirmRide.driver.id,
                    userID: confirmRide.customer_id,
                },
            });
        }
        catch (createRace) {
            throw new Error('Não foi possível calcular a estimativa de rota. Verifique os dados fornecidos.');
        }
    }
    async getRacesByCustomerId(filter) {
        const { customerId, driverId } = filter;
        try {
            return await this.prismaClient.race.findMany({
                where: {
                    userID: customerId,
                    ...(driverId && { driverId }),
                },
            });
        }
        catch (getRace) {
            throw new Error('Nao foi possivel buscar suas corridas');
        }
    }
}
exports.RideRepositoryImplementantion = RideRepositoryImplementantion;
