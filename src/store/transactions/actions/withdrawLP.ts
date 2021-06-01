import { ethers } from 'ethers';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { THUNK_PREFIX } from '../../enum';
import { crucibleAbi } from '../../../abi/crucibleAbi';
import { TxnStatus, TxnType } from '../types';
import bigNumberishToNumber from '../../../utils/bigNumberishToNumber';

export const withdraw = createAsyncThunk(
  THUNK_PREFIX.WITHDRAW,
  async ({
    web3React,
    config,
    monitorTx,
    updateTx,
    amountLp,
    crucibleAddress,
  }: any) => {
    const description = `Withdraw ${bigNumberishToNumber(amountLp)} LP`;

    updateTx({
      type: TxnType.withdraw,
      status: TxnStatus.Initiated,
      description,
    });

    const { library, account, chainId } = web3React;
    const signer = library.getSigner();
    const { lpTokenAddress } = config;

    const lpToken = new ethers.Contract(
      lpTokenAddress,
      IUniswapV2ERC20.abi,
      signer
    );

    const crucible = new ethers.Contract(crucibleAddress, crucibleAbi, signer);

    const balance = await lpToken.balanceOf(crucibleAddress);
    const lockedBalance = await crucible.getBalanceLocked(lpTokenAddress);

    if (balance.sub(lockedBalance).lt(amountLp)) {
      throw new Error(
        'Please claim and unsubscribe before withdrawing your LP tokens'
      );
    }

    updateTx({
      type: TxnType.withdraw,
      status: TxnStatus.PendingApproval,
      description,
      account,
      chainId,
    });

    const withdrawTx = await crucible.transferERC20(
      lpToken.address,
      account,
      amountLp
    );

    monitorTx(withdrawTx.hash);

    updateTx({
      type: TxnType.withdraw,
      status: TxnStatus.PendingOnChain,
      description,
      account,
      chainId,
      hash: withdrawTx.hash,
    });

    await withdrawTx.wait(1);

    updateTx({
      type: TxnType.withdraw,
      status: TxnStatus.Mined,
      description,
      account,
      chainId,
      hash: withdrawTx.hash,
    });
  }
);

export default withdraw;
