"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
class NotFoundException {
    status = 404;
    error_code;
    error_description;
    constructor(errorCode, errorDescription) {
        this.error_code = errorCode;
        this.error_description = errorDescription;
    }
}
exports.NotFoundException = NotFoundException;
