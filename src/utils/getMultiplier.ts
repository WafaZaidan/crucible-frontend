let zeros = '0';
while (zeros.length < 256) {
  zeros += zeros;
}

export default function getMultiplier(decimals: number = 18) {
  if (decimals >= 0 && decimals <= 256 && !(decimals % 1)) {
    return '1' + zeros.substring(0, decimals);
  }
  throw new Error(`invalid decimal size: ${decimals}`);
}
