import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Validate, ValidateNested } from 'class-validator';
import { MatchConstraintDistance } from '../../common/constraints/matchConstraintDistance';

export class LocationDTO {
  latitude!: number;
  longitude!: number;
}

class DriverDto {
  @IsNotEmpty()
  id!: number;

  @IsNotEmpty()
  name!: string;
}

export class CofirmRaceDTO {
  @IsNumber()
  @IsNotEmpty()
  customer_id!: number;

  @ValidateNested()
  @Type(() => LocationDTO)
  @Validate(MatchConstraintDistance)
  @IsNotEmpty()
  origin!: LocationDTO;

  @IsNotEmpty()
  destinationAdress!: string;

  @IsNotEmpty()
  originAdress!: string;

  @ValidateNested()
  @Type(() => LocationDTO)
  @IsNotEmpty()
  destination!: LocationDTO;

  @ValidateNested()
  @Type(() => DriverDto)
  @IsNotEmpty()
  driver!: DriverDto;

  @IsNotEmpty()
  distance!: number;

  @IsNotEmpty()
  duration!: string;

  @IsNotEmpty()
  @IsString()
  value!: string;
}
