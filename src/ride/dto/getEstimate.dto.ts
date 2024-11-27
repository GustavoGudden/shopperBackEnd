import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class LocationDTO {
  latitude!: number;
  longitude!: number;
}

export class EstimateRideDTO {
  @IsNotEmpty()
  @IsNumber()
  customer_id!: string;

  @ValidateNested()
  @Type(() => LocationDTO)
  @IsNotEmpty()
  origin!: LocationDTO;

  @ValidateNested()
  @Type(() => LocationDTO)
  @IsNotEmpty()
  destination!: LocationDTO;
}
