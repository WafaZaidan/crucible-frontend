import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { config } from '../config/variables';
import { crucibleAbi } from '../abi/crucibleAbi';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { CallbackArgs, EVENT } from '../hooks/useContract';

const { lpTokenAddress } = config;

export async function withdraw(
  signer: any,
  crucibleAddress: string,
  rawAmount: string,
  callback: (args: CallbackArgs) => void
) {
  const walletAddress = await signer.getAddress();

  const args = {
    crucible: crucibleAddress,
    token: lpTokenAddress,
    recipient: walletAddress,
    amount: rawAmount,
  };

  // fetch contracts

  const token = new ethers.Contract(
    lpTokenAddress,
    IUniswapV2ERC20.abi,
    signer
  );
  const crucible = new ethers.Contract(crucibleAddress, crucibleAbi, signer);

  // declare config

  const amount = parseUnits(rawAmount, 18);
  const recipient = args.recipient;

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
  } catch (e) {
    callback({
      type: EVENT.TX_ERROR,
      message: e.message,
      code: e.code,
    });
    console.log(e);
  }
}
