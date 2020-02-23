export default function convertToKilos(value: string | number) {
  let numberValue = Number(value);
  if (!isNaN(numberValue)) {
    return (numberValue / 1000).toString();
  }
  return '';
}
