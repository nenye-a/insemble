import { LOS_ANGELES_LOCATION } from '../constants/location';

export default function withinLA(latitude: number, longitude: number) {
  let { minLat, minLng, maxLat, maxLng } = LOS_ANGELES_LOCATION;
  if (latitude > maxLat || longitude > maxLng || latitude < minLat || longitude < minLng) {
    return false;
  }
  return true;
}
