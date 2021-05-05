import { BigNumber } from 'ethers';
import sanitisePositiveDecimalInput from './sanitisePositiveDecimalInput';
import numberishToBigNumber from './numberishToBigNumber';

export default function onNumberInputChange(
  amountNew: string | number,
  amountOld: string,
  amountMax: BigNumber | undefined,
  isMaxOld: boolean,
  setAmount: Function,
  setIsMax: Function
) {
  amountNew = amountNew.toString();
  let isMaxNew = false;
  try {
    amountNew = sanitisePositiveDecimalInput(amountNew, amountOld);
    // Assert that amountNew can be coerced to a BigNumber
    const amountNewBigNumber = numberishToBigNumber(amountNew || 0);
    if (amountMax) {
      // Need a threshold check so that if slider's maxValue is greater than lpBalance due to rounding then maxing the slider sets isMax to true
      isMaxNew = amountMax.sub(amountNewBigNumber).abs().lt(10);
    }
    setAmount(amountNew);
  } catch (err) {
    isMaxNew = isMaxOld;
    // Ensure we don't crash the app by feeding a bad value to numberishToBigNumber
    setAmount(amountOld);
  }
  setIsMax(isMaxNew);
}
