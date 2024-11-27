"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClient = getPrismaClient;
exports.connectToPrisma = connectToPrisma;
exports.disconnectFromPrisma = disconnectFromPrisma;
const client_1 = require("@prisma/client");
const prismaClient = new client_1.PrismaClient();
function getPrismaClient() {
    return prismaClient;
}
async function connectToPrisma(prismaClient) {
    await prismaClient.$connect();
}
async function disconnectFromPrisma(prismaClient) {
    await prismaClient.$disconnect();
}
