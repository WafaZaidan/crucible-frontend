import { BigNumber, ethers, Signer } from 'ethers';
import { CallbackArgs, EVENT } from '../hooks/useContract';
import { _abi } from '../interfaces/Erc20DetailedFactory';

async function depositToCrucible(
  signer: Signer,
  crucibleAddress: string,
  tokenAddress: string,
  amount: BigNumber,
  callback: (args: CallbackArgs) => void
) {
  const tokenContract = new ethers.Contract(tokenAddress, _abi, signer);

  callback({
    type: EVENT.PENDING_APPROVAL,
  });

  try {
    callback({
      type: EVENT.PENDING_APPROVAL,
    });

    const depositTx = await tokenContract.transfer(crucibleAddress, amount);

    callback({
      type: EVENT.TX_CONFIRMED,
      message: 'success',
      txHash: depositTx.hash,
    });

    await depositTx.wait(1);

    callback({
      type: EVENT.TX_MINED,
    });
  } catch (e) {
    callback({
      type: EVENT.TX_ERROR,
      message: e.message,
      code: e.code,
    });
  }
}

export default depositToCrucible;
