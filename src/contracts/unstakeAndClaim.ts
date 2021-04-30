import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { signPermission } from './utils';
import { aludelAbi } from '../abi/aludelAbi';
import { crucibleAbi } from '../abi/crucibleAbi';
import { config } from '../config/variables';
import { CallbackArgs, EVENT } from '../hooks/useContract';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';

const { aludelAddress } = config;

export async function unstakeAndClaim(
  signer: any,
  crucibleAddress: string,
  rawAmount: string,
  callback: (args: CallbackArgs) => void
) {
  const walletAddress = await signer.getAddress();

  const args = {
    crucible: crucibleAddress,
    aludel: aludelAddress,
    recipient: walletAddress,
    amount: rawAmount,
  };

  // fetch contracts
  const aludel = new ethers.Contract(args.aludel, aludelAbi, signer);
  const stakingToken = new ethers.Contract(
    (await aludel.getAludelData()).stakingToken,
    IUniswapV2ERC20.abi,
    signer
  );
  const crucible = new ethers.Contract(args.crucible, crucibleAbi, signer);

  const amount = parseUnits(args.amount, await stakingToken.decimals());
  const nonce = await crucible.getNonce();
  const recipient = args.recipient;

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
