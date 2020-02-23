export default function convertToKilos(value: string | number) {
  let valueString = value.toString();
  return valueString.slice(0, -3);
}
