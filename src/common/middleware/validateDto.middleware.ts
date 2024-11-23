import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateDTO<T extends object>(dtoClass: new (...args: any[]) => T) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dtoInstance = plainToInstance(dtoClass, req.body);
      const errors = await validate(dtoInstance);
      if (errors.length > 0) {
        res.status(400).json({
          message: 'Validation failed',
          errors: errors.map((err) => Object.values(err.constraints || {})).flat(),
        });
        return;
      }
      req.body = dtoInstance;
      next();
    } catch (error) {
      next(error);
    }
  };
}
