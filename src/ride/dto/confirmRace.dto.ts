import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

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
  @IsNotEmpty()
  @IsNumber()
  customer_id!: number;

  @ValidateNested()
  @Type(() => LocationDTO)
  @IsNotEmpty()
  origin!: LocationDTO;

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
