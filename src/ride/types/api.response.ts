export interface IResponseDistance {
  distanceMeters: number;
  duration: string;
  polyline: {
    encodedPolyline: string;
  };
}

export interface ApiResponse {
  routes: IResponseDistance[];
}
