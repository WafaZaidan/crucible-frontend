import { ethers } from 'ethers';
import { crucibleFactoryAbi } from '../abi/crucibleFactoryAbi';
import { CallbackArgs, EVENT } from '../hooks/useContract';
import { Config } from '../hooks/useConfigVariables';
import { UseTransactions } from '../store/transactions/types';

async function transferCrucible(
  config: Config,
  transactionActions: UseTransactions,
  signer: any,
  id: string,
  to: string,
  callback: (args: CallbackArgs) => void
) {
  const { crucibleFactoryAddress } = config;
  const walletAddress = await signer.getAddress();

  const crucibleFactory = new ethers.Contract(
    crucibleFactoryAddress,
    crucibleFactoryAbi,
    signer
  );

  callback({
    type: EVENT.PENDING_APPROVAL,
  });

  try {
    const tx = await crucibleFactory[
      'safeTransferFrom(address,address,uint256)'
    ](walletAddress, to, ethers.BigNumber.from(id));

    callback({
      type: EVENT.TX_CONFIRMED,
      message: 'success',
      txHash: tx.hash,
    });

    await tx.wait(1);
    callback({
      type: EVENT.TX_MINED,
    });
  } catch (e) {
    console.log(e);
    callback({
      type: EVENT.TX_ERROR,
      message: e.message,
      code: e.code,
    });
  }
}

export default transferCrucible;
