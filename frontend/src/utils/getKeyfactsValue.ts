import { convertToKilos } from '.';

export default function getKeyfactsValue(val?: number | null) {
  if (val && val >= 10000) {
    let formatted = convertToKilos(val).split('.')[0] + 'K';
    return formatted;
  }
  return val;
}
