import { ethers } from 'ethers';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { THUNK_PREFIX } from '../../enum';
import { crucibleAbi } from '../../../abi/crucibleAbi';
import { TxnStatus, TxnType } from '../types';
import bigNumberishToNumber from '../../../utils/bigNumberishToNumber';
import parseTransactionError from '../../../utils/parseTransactionError';

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
    const txnId = uuid();
    const description = `Withdraw ${bigNumberishToNumber(amountLp)} LP`;

    updateTx({
      id: txnId,
      type: TxnType.withdraw,
      status: TxnStatus.Initiated,
      description,
    });

    try {
      const { library, account, chainId } = web3React;
      const signer = library.getSigner();
      const { lpTokenAddress } = config;

      const lpToken = new ethers.Contract(
        lpTokenAddress,
        IUniswapV2ERC20.abi,
        signer
      );

      const crucible = new ethers.Contract(
        crucibleAddress,
        crucibleAbi,
        signer
      );

      const balance = await lpToken.balanceOf(crucibleAddress);
      const lockedBalance = await crucible.getBalanceLocked(lpTokenAddress);

      if (balance.sub(lockedBalance).lt(amountLp)) {
        throw new Error(
          'Please claim and unsubscribe before withdrawing your LP tokens'
        );
      }

      updateTx({
        id: txnId,
        status: TxnStatus.PendingApproval,
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
        id: txnId,
        status: TxnStatus.PendingOnChain,
        hash: withdrawTx.hash,
      });

      await withdrawTx.wait(1);

      updateTx({
        id: txnId,
        status: TxnStatus.Mined,
      });
    } catch (error) {
      const errorMessage = parseTransactionError(error);

      updateTx({
        id: txnId,
        status: TxnStatus.Failed,
        error: errorMessage,
      });

      // trigger redux toolkit's rejected.match hook
      throw error;
    }
  }
);

export default withdraw;
