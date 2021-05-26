import { createAsyncThunk } from '@reduxjs/toolkit';
import { THUNK_PREFIX } from '../../enum';
import { TxnStatus } from '../types';
import { ethers } from 'ethers';
import { crucibleFactoryAbi } from '../../../abi/crucibleFactoryAbi';
import { truncate } from '../../../utils/address';

export const transferCrucible = createAsyncThunk(
  THUNK_PREFIX.TRANSFER_CRUCIBLE,
  async ({
    web3React,
    config,
    monitorTx,
    transferTo,
    crucibleId,
    updateTx,
  }: any) => {
    const { account, library } = web3React;
    const signer = library.getSigner();
    const { crucibleFactoryAddress } = config;

    // Set transfer status to INITIATED
    updateTx({
      status: TxnStatus.Initiated,
      description: `Transfer crucible ${truncate(crucibleId)} to ${truncate(
        transferTo
      )}`,
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
      status: TxnStatus.PendingApproval,
      description: `Transfer crucible ${truncate(crucibleId)} to ${truncate(
        transferTo
      )}`,
    });

    // Ask user to confirm txn
    const tx = await crucibleFactory[
      'safeTransferFrom(address,address,uint256)'
    ](account, transferTo, ethers.BigNumber.from(crucibleId));

    // set up the tx popup monitor
    monitorTx(tx.hash);

    // Set transfer status to PENDING ON CHAIN
    updateTx({
      status: TxnStatus.PendingOnChain,
      hash: tx.hash,
      description: `Transfer crucible ${truncate(crucibleId)} to ${truncate(
        transferTo
      )}`,
    });

    // wait for 1 block confirmation
    await tx.wait(1);

    // Set transfer status to MINED
    updateTx({
      status: TxnStatus.Mined,
      description: `Transfer crucible ${truncate(crucibleId)} to ${truncate(
        transferTo
      )}`,
    });

    return;
  }
);
