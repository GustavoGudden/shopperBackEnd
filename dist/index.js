"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const prisma_client_1 = require("./common/clients/prisma.client");
const app_module_1 = require("./app/app.module");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function bootstrap() {
    const prismaClient = (0, prisma_client_1.getPrismaClient)();
    (0, prisma_client_1.connectToPrisma)(prismaClient).then(() => {
        new app_module_1.AppModule({
            port: 3001,
            ormClient: prismaClient,
        });
    });
}
bootstrap();
