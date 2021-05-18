import { BigNumber, ethers } from 'ethers';
import { signPermission } from './utils';
import { aludelAbi } from '../abi/aludelAbi';
import { crucibleAbi } from '../abi/crucibleAbi';
import { CallbackArgs, EVENT } from '../hooks/useContract';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { Config } from '../hooks/useConfigVariables';
import { UseTransactions } from '../store/transactions/types';

async function unstakeAndClaim(
  config: Config,
  transactionActions: UseTransactions,
  signer: any,
  crucibleAddress: string,
  amount: BigNumber,
  callback: (args: CallbackArgs) => void
) {
  const { aludelAddress } = config;
  const walletAddress = await signer.getAddress();

  // fetch contracts
  const aludel = new ethers.Contract(aludelAddress, aludelAbi, signer);
  const stakingToken = new ethers.Contract(
    (await aludel.getAludelData()).stakingToken,
    IUniswapV2ERC20.abi,
    signer
  );
  const crucible = new ethers.Contract(crucibleAddress, crucibleAbi, signer);

  const nonce = await crucible.getNonce();
  const recipient = walletAddress;

  try {
    // validate balances
    if ((await stakingToken.balanceOf(crucible.address)).lt(amount)) {
      throw new Error('You do not have enough LP tokens');
    }

    callback({
      type: EVENT.PENDING_SIGNATURE,
      step: 1,
      totalSteps: 1,
    });

    // craft permission
    console.log('Sign Unlock permission');
    const permission = await signPermission(
      'Unlock',
      crucible,
      signer,
      aludel.address,
      stakingToken.address,
      amount,
      nonce
    );

    console.log('Unstake and Claim');

    const populatedTx = await aludel.populateTransaction.unstakeAndClaim(
      crucible.address,
      recipient,
      amount,
      permission
    );

    callback({
      type: EVENT.PENDING_APPROVAL,
    });
    console.log('Populated tx');

    const unstakeTx = await signer.sendTransaction(populatedTx);

    console.log('  in', unstakeTx.hash);
    console.log('Withdraw from crucible');

    callback({
      type: EVENT.TX_CONFIRMED,
      message: 'success',
      txHash: unstakeTx.hash,
    });

    const withdrawTx = await crucible.transferERC20(
      stakingToken.address,
      recipient,
      amount
    );

    console.log('  in', withdrawTx?.hash);

    callback({
      type: EVENT.TX_CONFIRMED,
      message: 'success',
      txHash: withdrawTx.hash,
    });
    await unstakeTx.wait(1);
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
    console.log(e);
  }
}

export default unstakeAndClaim;
