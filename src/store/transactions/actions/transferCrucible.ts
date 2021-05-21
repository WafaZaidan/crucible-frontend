import { createAsyncThunk } from '@reduxjs/toolkit';
import { THUNK_PREFIX } from '../../enum';
import { TxnStatus, TxnType } from '../types';
import { transactionsSlice } from '../reducer';
import { ethers } from 'ethers';
import { crucibleFactoryAbi } from '../../../abi/crucibleFactoryAbi';
import { truncate } from '../../../utils/address';

export const transferCrucible = createAsyncThunk(
  THUNK_PREFIX.TRANSFER_CRUCIBLE,
  async (
    { web3React, config, monitorTx, transferTo, crucibleId }: any,
    { dispatch }
  ) => {
    const { account, library } = web3React;
    const signer = library.getSigner();
    const { crucibleFactoryAddress } = config;

    // Set transfer status to INITIATED
    dispatch(
      transactionsSlice.actions.setTransactionStatus({
        type: TxnType.transfer,
        status: TxnStatus.Initiated,
        description: `Transfer crucible ${truncate(crucibleId)} to ${truncate(
          transferTo
        )}`,
      })
    );

    // Create a crucible factory contract instance
    const crucibleFactory = new ethers.Contract(
      crucibleFactoryAddress,
      crucibleFactoryAbi,
      signer
    );

    try {
      // Set transfer status to PENDING APPROVAL
      dispatch(
        transactionsSlice.actions.setTransactionStatus({
          type: TxnType.transfer,
          status: TxnStatus.PendingApproval,
        })
      );

      // Ask user to confirm txn
      const tx = await crucibleFactory[
        'safeTransferFrom(address,address,uint256)'
      ](account, transferTo, ethers.BigNumber.from(crucibleId));

      monitorTx(tx.hash);

      // Set transfer status to PENDING ON CHAIN
      dispatch(
        transactionsSlice.actions.setTransactionStatus({
          type: TxnType.transfer,
          status: TxnStatus.PendingOnChain,
          hash: tx.hash,
        })
      );

      // wait for 1 block confirmation
      await tx.wait(1);

      // Set transfer status to MINED
      dispatch(
        transactionsSlice.actions.setTransactionStatus({
          type: TxnType.transfer,
          status: TxnStatus.Mined,
        })
      );
    } catch (e) {
      console.log(e);
      dispatch(
        transactionsSlice.actions.setTransactionStatus({
          type: TxnType.transfer,
          status: TxnStatus.Failed,
        })
      );
    }

    return;
  }
);
