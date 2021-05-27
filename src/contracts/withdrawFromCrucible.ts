import { BigNumber, ethers, Signer } from 'ethers';
import { crucibleAbi } from '../abi/crucibleAbi';
import { CallbackArgs, EVENT } from '../hooks/useContract';

async function withdrawFromCrucible(
  crucibleAddress: string,
  tokenAddress: string,
  signer: Signer,
  amount: BigNumber,
  callback: (args: CallbackArgs) => void
) {
  try {
    const walletAddress = await signer.getAddress();
    const crucible = new ethers.Contract(crucibleAddress, crucibleAbi, signer);

    callback({
      type: EVENT.PENDING_APPROVAL,
    });

    const withdrawTx = await crucible.transferERC20(
      tokenAddress,
      walletAddress,
      amount
    );

    callback({
      type: EVENT.TX_CONFIRMED,
      message: 'success',
      txHash: withdrawTx.hash,
    });

    await withdrawTx.wait(1);

    callback({
      type: EVENT.TX_MINED,
    });
  } catch (e) {
    // Hack to silence 'Internal JSON-RPC error'
    if (e.code === -32603) {
      return;
    }
    callback({
      type: EVENT.TX_ERROR,
      message: e.message,
      code: e.code,
    });
  }
}

export default withdrawFromCrucible;
