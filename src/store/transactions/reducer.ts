import { createSlice } from '@reduxjs/toolkit';
import { TxnState, TxnStatus, TxnType } from './types';
import {
  addTransactionToStore,
  updateTransaction,
  clearTransaction,
} from './actions';

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
  name: 'transactions',
  initialState,
  reducers: {
    addTransactionToStore,
    updateTransaction,
    clearTransaction,
  },
});

export default transactionsSlice.reducer;
