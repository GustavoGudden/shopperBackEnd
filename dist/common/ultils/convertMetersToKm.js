"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMetersToKm = void 0;
const convertMetersToKm = (meter) => {
    if (meter < 0) {
        throw new Error('The value of meters cannot be negative.');
    }
    const kilometers = meter / 1000;
    return kilometers;
};
exports.convertMetersToKm = convertMetersToKm;
