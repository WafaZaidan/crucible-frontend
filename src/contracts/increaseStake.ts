import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { signPermission, signPermitEIP2612 } from './utils';
import { aludelAbi } from '../abi/aludelAbi';
import { crucibleAbi } from '../abi/crucibleAbi';
import { transmuterAbi } from '../abi/transmuterAbi';
import { config } from '../config/variables';
import { CallbackArgs, EVENT } from '../hooks/useContract';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';

const { aludelAddress, transmuterAddress, crucibleFactoryAddress } = config;

export async function increaseStake(
  signer: any,
  crucibleAddress: string,
  rawAmount: string,
  callback: (args: CallbackArgs) => void
) {
  const walletAddress = await signer.getAddress();

  const args = {
    crucible: crucibleAddress,
    aludel: aludelAddress,
    transmuter: transmuterAddress,
    crucibleFactory: crucibleFactoryAddress,
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

  const transmuter = new ethers.Contract(
    args.transmuter,
    transmuterAbi,
    signer
  );

  const amount = parseUnits(args.amount, await stakingToken.decimals());
  const nonce = await crucible.getNonce();
  const deadline = Date.now() + 60 * 60 * 24; // 1 day deadline

  // validate balances
  if ((await stakingToken.balanceOf(walletAddress)).lt(amount)) {
    alert('You must have more Alchemist Liquidity Pool tokens');
    throw new Error('Stake amount exceeds available LP token balance');
  }

  try {
    callback({
      type: EVENT.PENDING_SIGNATURE,
      step: 1,
      totalSteps: 2,
    });

    // craft permission
    console.log('Sign Unlock perm ission');

    const permit = await signPermitEIP2612(
      signer,
      walletAddress,
      stakingToken,
      transmuter.address,
      amount,
      deadline
    );

    callback({
      type: EVENT.PENDING_SIGNATURE,
      step: 2,
      totalSteps: 2,
    });

    const permission = await signPermission(
      'Lock',
      crucible,
      signer,
      aludel.address,
      stakingToken.address,
      amount,
      nonce
    );

    callback({
      type: EVENT.PENDING_APPROVAL,
    });

    const tx = await transmuter.permitAndStake(
      aludel.address,
      crucibleAddress,
      permit,
      permission
    );

    callback({
      type: EVENT.TX_CONFIRMED,
      message: 'success',
      txHash: tx.hash,
    });

    console.log('  in', tx.hash);
    return tx.hash;
  } catch (e) {
    callback({
      type: EVENT.TX_ERROR,
      message: e.message,
      code: e.code,
    });
    console.log(e);
  }
}
