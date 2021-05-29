import { createAsyncThunk } from '@reduxjs/toolkit';
import { THUNK_PREFIX } from '../../enum';
import { TxnStatus, TxnType } from '../types';
import { ethers } from 'ethers';
import { crucibleFactoryAbi } from '../../../abi/crucibleFactoryAbi';
import { truncate } from '../../../utils/address';

export interface TransferCrucibleArgs {
  type: TxnType;
  status?: TxnStatus;
  description?: string;
  hash?: string;
  chainId: number;
  account: string;
}

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

    const description = `Transfer to ${truncate(transferTo)}`;

    // Set transfer status to INITIATED
    updateTx({
      type: TxnType.transfer,
      status: TxnStatus.Initiated,
      description,
    });

    // Create a crucible factory contract instance
    const crucibleFactory = new ethers.Contract(
      crucibleFactoryAddress,
      crucibleFactoryAbi,
      signer
    );

    // try {
    // Set transfer status to PENDING APPROVAL
    updateTx({
      type: TxnType.transfer,
      status: TxnStatus.PendingApproval,
      description,
    });

    // Ask user to confirm txn
    const tx = await crucibleFactory[
      'safeTransferFrom(address,address,uint256)'
    ](account, transferTo, ethers.BigNumber.from(crucibleId));

    // set up the tx popup monitor
    monitorTx(tx.hash);

    // Set transfer status to PENDING ON CHAIN
    updateTx({
      type: TxnType.transfer,
      status: TxnStatus.PendingOnChain,
      hash: tx.hash,
      description,
    });

    // wait for 1 block confirmation
    await tx.wait(1);

    // Set transfer status to MINED
    updateTx({
      type: TxnType.transfer,
      status: TxnStatus.Mined,
      description,
    });

    return;
  }
);
