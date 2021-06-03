import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SLICE_NAME } from '../enum';
import { TxnDetails, TxnState } from './types';

export const initialState: TxnState = {
  transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
};

export const transactionsSlice = createSlice({
  name: SLICE_NAME.TRANSACTIONS,
  initialState,
  reducers: {
    clearSavedTransactions: (state) => {
      localStorage.clear();
      state.transactions = [];
    },
    setTransactionStatus: (state, action: PayloadAction<TxnDetails>) => {
      const currentTransaction =
        state.transactions.filter((txn) => txn.id === action.payload.id)[0] ||
        {};

      const updatedTransaction = {
        ...currentTransaction,
        ...(action.payload || {}),
      };

      const savedTxns: TxnDetails[] = JSON.parse(
        localStorage.getItem('transactions') || '[]'
      );

      const indexToUpdate = savedTxns.findIndex(
        (t) => t.id === updatedTransaction.id
      );

      // push to local storage if the txn isn't saved there
      if (indexToUpdate === -1) {
        savedTxns.push(updatedTransaction);
      } else {
        // otherwise update the transaction
        savedTxns[indexToUpdate] = updatedTransaction;
      }

      localStorage.setItem('transactions', JSON.stringify(savedTxns));
      state.transactions = savedTxns;
    },
  },
});

export default transactionsSlice.reducer;
