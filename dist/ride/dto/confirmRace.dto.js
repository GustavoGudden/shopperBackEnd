"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CofirmRaceDTO = exports.LocationDTO = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const matchConstraintDistance_1 = require("../../common/constraints/matchConstraintDistance");
class LocationDTO {
    latitude;
    longitude;
}
exports.LocationDTO = LocationDTO;
class DriverDto {
    id;
    name;
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], DriverDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DriverDto.prototype, "name", void 0);
class CofirmRaceDTO {
    customer_id;
    origin;
    destinationAdress;
    originAdress;
    destination;
    driver;
    distance;
    duration;
    value;
}
exports.CofirmRaceDTO = CofirmRaceDTO;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CofirmRaceDTO.prototype, "customer_id", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LocationDTO),
    (0, class_validator_1.Validate)(matchConstraintDistance_1.MatchConstraintDistance),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", LocationDTO)
], CofirmRaceDTO.prototype, "origin", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CofirmRaceDTO.prototype, "destinationAdress", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CofirmRaceDTO.prototype, "originAdress", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LocationDTO),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", LocationDTO)
], CofirmRaceDTO.prototype, "destination", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DriverDto),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", DriverDto)
], CofirmRaceDTO.prototype, "driver", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CofirmRaceDTO.prototype, "distance", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CofirmRaceDTO.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CofirmRaceDTO.prototype, "value", void 0);
