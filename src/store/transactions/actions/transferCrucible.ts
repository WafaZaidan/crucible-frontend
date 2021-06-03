import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { v4 as uuid } from 'uuid';
import { THUNK_PREFIX } from '../../enum';
import { TxnStatus, TxnType } from '../types';
import { crucibleFactoryAbi } from '../../../abi/crucibleFactoryAbi';
import { truncate } from '../../../utils/address';
import parseTransactionError from '../../../utils/parseTransactionError';

export const transferCrucible = createAsyncThunk(
  THUNK_PREFIX.TRANSFER_CRUCIBLE,
  async ({
    web3React,
    config,
    monitorTx,
    updateTx,
    transferTo,
    crucibleId,
  }: any) => {
    const { account, library } = web3React;
    const signer = library.getSigner();
    const { crucibleFactoryAddress } = config;
    const txnId = uuid();

    const description = `Transfer to ${truncate(transferTo)}`;

    // Set transfer status to INITIATED
    updateTx({
      id: txnId,
      type: TxnType.transfer,
      status: TxnStatus.Initiated,
      description,
    });

    try {
      // Create a crucible factory contract instance
      const crucibleFactory = new ethers.Contract(
        crucibleFactoryAddress,
        crucibleFactoryAbi,
        signer
      );

      // Set transfer status to PENDING APPROVAL
      updateTx({
        id: txnId,
        status: TxnStatus.PendingApproval,
      });

      // Ask user to confirm txn
      const tx = await crucibleFactory[
        'safeTransferFrom(address,address,uint256)'
      ](account, transferTo, ethers.BigNumber.from(crucibleId));

      // set up the tx popup monitor
      monitorTx(tx.hash);

      // Set transfer status to PENDING ON CHAIN
      updateTx({
        id: txnId,
        status: TxnStatus.PendingOnChain,
        hash: tx.hash,
      });

      // wait for 1 block confirmation
      await tx.wait(1);

      // Set transfer status to MINED
      updateTx({
        id: txnId,
        status: TxnStatus.Mined,
      });

      return txnId;
    } catch (error) {
      console.log(error);

      const errorMessage = parseTransactionError(error);

      // Set transfer status to FAILED
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
