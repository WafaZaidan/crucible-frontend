import { ethers } from 'ethers';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { THUNK_PREFIX } from '../../enum';
import { crucibleAbi } from '../../../abi/crucibleAbi';
import { transmuterAbi } from '../../../abi/transmuterAbi';
import { aludelAbi } from '../../../abi/aludelAbi';
import { signPermission, signPermitEIP2612 } from '../../../contracts/utils';
import { wait } from '../../../utils/wait';
import { TxnStatus, TxnType } from '../types';
import bigNumberishToNumber from '../../../utils/bigNumberishToNumber';

export const increaseLP = createAsyncThunk(
  THUNK_PREFIX.INCREASE_LP,
  async ({
    web3React,
    config,
    monitorTx,
    updateTx,
    amountLp,
    crucibleAddress,
  }: any) => {
    const description = `Increase staking position by ${bigNumberishToNumber(
      amountLp
    )} LP`;

    updateTx({
      type: TxnType.increaseLp,
      status: TxnStatus.Initiated,
      description,
    });

    const { library, account, chainId } = web3React;
    const signer = library.getSigner();
    const { aludelAddress, transmuterAddress } = config;

    //set up the aludel, staking, factory and transmuter contract instances
    const aludel = new ethers.Contract(aludelAddress, aludelAbi, signer);

    const { stakingToken: tokenAddress } = await aludel.getAludelData();

    const stakingToken = new ethers.Contract(
      tokenAddress,
      IUniswapV2ERC20.abi,
      signer
    );

    const crucible = new ethers.Contract(crucibleAddress, crucibleAbi, signer);

    const transmuter = new ethers.Contract(
      transmuterAddress,
      transmuterAbi,
      signer
    );

    const nonce = await crucible.getNonce();
    const deadline = Date.now() + 60 * 60 * 24; // 1 day deadline

    // validate balances
    if ((await stakingToken.balanceOf(account)).lt(amountLp)) {
      alert('You must have more Alchemist Liquidity Pool tokens');
      throw new Error('Stake amount exceeds available LP token balance');
    }

    updateTx({
      type: TxnType.increaseLp,
      status: TxnStatus.PendingApproval,
      description,
      account,
      chainId,
    });

    const permit = await signPermitEIP2612(
      signer,
      account,
      stakingToken,
      transmuter.address,
      amountLp,
      deadline
    );

    await wait(300);

    const permission = await signPermission(
      'Lock',
      crucible,
      signer,
      aludel.address,
      stakingToken.address,
      amountLp,
      nonce
    );

    const tx = await transmuter.permitAndStake(
      aludel.address,
      crucibleAddress,
      permit,
      permission
    );

    monitorTx(tx.hash);

    updateTx({
      type: TxnType.increaseLp,
      status: TxnStatus.PendingOnChain,
      description,
      account,
      chainId,
      hash: tx.hash,
    });

    await tx.wait(1);

    updateTx({
      type: TxnType.mint,
      status: TxnStatus.Mined,
      description,
      account,
      chainId,
      hash: tx.hash,
    });
  }
);

export default increaseLP;
