import { parseUnits } from 'ethers/lib/utils';

export default function numberishToBigNumber(
  value: number | string,
  units?: number | string
) {
  return parseUnits(value.toString(), units);
}
