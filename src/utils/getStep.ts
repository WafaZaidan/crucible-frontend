export default function getStep(value: number) {
  let step = 1;
  if (value !== 0) {
    // Sets step value to the power of ten that's between a tenth and a hundredth of the max value
    const exponent = Math.floor(Math.log10(value) - 1);
    // Some negative exponents resulting in recurring decimals, so do 1/x instead
    if (exponent < 0) {
      step = 1 / 10 ** -exponent;
    } else {
      step = 10 ** exponent;
    }
  }
  return step;
}
