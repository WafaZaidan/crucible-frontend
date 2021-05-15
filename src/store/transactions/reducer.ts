import { createSlice } from '@reduxjs/toolkit';
import { TxnState } from './types';
import { addTransactionToQueue } from './actions';

export const initialState: TxnState = {};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransactionToQueue,
  },
});

export default transactionsSlice.reducer;
