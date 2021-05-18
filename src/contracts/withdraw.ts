import { BigNumber, ethers } from 'ethers';
import { crucibleAbi } from '../abi/crucibleAbi';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { CallbackArgs, EVENT } from '../hooks/useContract';
import { Config } from '../hooks/useConfigVariables';
import { UseTransactions } from '../store/transactions/types';

async function withdraw(
  config: Config,
  transactionActions: UseTransactions,
  signer: any,
  crucibleAddress: string,
  amount: BigNumber,
  callback: (args: CallbackArgs) => void
) {
  const { lpTokenAddress } = config;
  const recipient = await signer.getAddress();

  // fetch contracts
  const token = new ethers.Contract(
    lpTokenAddress,
    IUniswapV2ERC20.abi,
    signer
  );
  const crucible = new ethers.Contract(crucibleAddress, crucibleAbi, signer);

  try {
    // validate balances
    const balance = await token.balanceOf(crucibleAddress);
    const lock = await crucible.getBalanceLocked(lpTokenAddress);
    if (balance.sub(lock).lt(amount)) {
      throw new Error(
        'Please claim and unsubscribe before withdrawing your LP tokens'
      );
    }

    console.log('Withdraw from crucible');
    callback({
      type: EVENT.PENDING_APPROVAL,
    });

    const withdrawTx = await crucible.transferERC20(
      token.address,
      recipient,
      amount
    );
    callback({
      type: EVENT.TX_CONFIRMED,
      message: 'success',
      txHash: withdrawTx.hash,
    });
    console.log('  in', withdrawTx.hash);

    await withdrawTx.wait(1);
    callback({ type: EVENT.TX_MINED });
  } catch (e) {
    callback({
      type: EVENT.TX_ERROR,
      message: e.message,
      code: e.code,
    });
    console.log(e);
  }
}

export default withdraw;
