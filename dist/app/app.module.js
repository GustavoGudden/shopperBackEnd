"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const prisma_client_1 = require("../common/clients/prisma.client");
// Modules
const ride_module_1 = require("../ride/ride.module");
class AppModule {
    app;
    server;
    prismaClient;
    constructor(appOptions) {
        this.app = (0, express_1.default)();
        this.prismaClient = appOptions.ormClient;
        this.startServer(appOptions.port);
    }
    async startServer(port) {
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)({ origin: '*' }));
        this.loadApplicationModules();
        this.server = this.app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
        process.on('beforeExit', async () => {
            await this.closeServer();
        });
    }
    async closeServer() {
        await (0, prisma_client_1.disconnectFromPrisma)(this.prismaClient);
        this.server.close();
    }
    loadApplicationModules() {
        new ride_module_1.RideModule(this.prismaClient).start(this.app);
    }
}
exports.AppModule = AppModule;
