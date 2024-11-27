import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CofirmRaceDTO } from '../../ride/dto/confirmRace.dto';

@ValidatorConstraint({ name: 'matchConstraintDistance', async: false })
export class MatchConstraintDistance implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    const confirmRaceDto = validationArguments?.object as CofirmRaceDTO;
    return JSON.stringify(value) != JSON.stringify(confirmRaceDto.destination);
  }

  defaultMessage(): string {
    return 'The origin location cannot be the same as the destination. Please check the information and try again.';
  }
}
