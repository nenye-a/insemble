const DEFAULT_FIXED_NUMBER = 1;

export default function roundDecimal(
  decimal: number | string,
  fixed: number = DEFAULT_FIXED_NUMBER
) {
  let number = Number(decimal);
  if (isNaN(number)) {
    return decimal;
  }
  let multiplier = getMultiplier(10, fixed);

  return Math.round((number * multiplier) % multiplier) > 0
    ? number.toFixed(fixed)
    : number.toFixed();
}

function getMultiplier(multiplier: number, fixed: number) {
  let multi = !multiplier ? 10 : multiplier;
  if (fixed > 1) {
    getMultiplier(multi * multi, fixed - 1);
  }
  return multi;
}
