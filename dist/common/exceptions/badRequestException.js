"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = void 0;
class BadRequestException {
    status = 400;
    error_code;
    error_description;
    constructor(errorCode, errorDescription) {
        this.error_code = errorCode;
        this.error_description = errorDescription;
    }
}
exports.BadRequestException = BadRequestException;
