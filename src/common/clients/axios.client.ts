import axios, { AxiosInstance } from 'axios';

export const axiosClient: AxiosInstance = axios.create({
  baseURL: 'https://routes.googleapis.com',
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
  },
});
