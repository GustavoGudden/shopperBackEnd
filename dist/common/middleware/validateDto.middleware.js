"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDTO = validateDTO;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function validateDTO(dtoClass) {
    return async (req, res, next) => {
        try {
            const dtoInstance = (0, class_transformer_1.plainToInstance)(dtoClass, req.body);
            const errors = await (0, class_validator_1.validate)(dtoInstance);
            if (errors.length > 0) {
                res.status(400).json({
                    error_code: 'INVALID_DATA',
                    error_description: errors.map((err) => Object.values(err.constraints || {})).flat()[0],
                });
                return;
            }
            req.body = dtoInstance;
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
