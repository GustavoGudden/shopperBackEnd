// Dto
import { EstimateRideDTO } from '../dto/getEstimate.dto';

//  Type
import { ApiResponse } from '../types/api.response';

export abstract class RideRepository {
  abstract fetchDistance(getEstimateDto: EstimateRideDTO): Promise<ApiResponse>;
}
