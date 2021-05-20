import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';
import { SLICE_NAME } from '../enum';
import { TxnState, TxnStatus, TxnType, UseTransactions } from './types';
import { transferCrucible as _transferCrucible } from './actions/transferCrucible';
import { useConfig } from '../config';
import { useWeb3React } from '@web3-react/core';

export const initialState: TxnState = {
  [TxnType.mint]: {
    status: TxnStatus.Ready,
  },
  [TxnType.increaseStake]: {
    status: TxnStatus.Ready,
  },
  [TxnType.transfer]: {
    status: TxnStatus.Ready,
  },
  [TxnType.claim]: {
    status: TxnStatus.Ready,
  },
  [TxnType.withdraw]: {
    status: TxnStatus.Ready,
  },
};

export const transactionsSlice = createSlice({
  name: SLICE_NAME.TRANSACTIONS,
  initialState,
  reducers: {
    setTransactionStatus: (state, action) => {
      const { type, status } = action.payload;
      const txnState = state[type as TxnType];

      state[type as TxnType] = {
        ...txnState,
        status,
      };
    },
  },
});

export const useTransactions = (): UseTransactions => {
  const dispatch = useAppDispatch();
  const { config } = useConfig();
  const web3React = useWeb3React();
  const configForNetwork = config[web3React.chainId || 1];
  const transactions = useAppSelector((state) => state.transactions);

  const transferCrucible = (crucibleId: string, transferTo: string) =>
    dispatch(
      _transferCrucible({
        config: configForNetwork,
        web3React,
        transferTo,
        crucibleId,
      })
    );

  return {
    transactions,
    transferCrucible,
  };
};

export default transactionsSlice.reducer;
