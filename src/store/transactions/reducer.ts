import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SLICE_NAME } from '../enum';
import { TxnDetails, TxnState, TxnStatus } from './types';
import { TransferCrucibleArgs } from './actions/transferCrucible';

const updateLocalStorageSavedTransactions = (txn: TxnDetails) => {
  const savedTxns: TxnDetails[] = JSON.parse(
    localStorage.getItem('transactions') || '[]'
  );
  // @ts-ignore
  const txnIdx = savedTxns.findIndex((t) => t.hash === txn.hash);

  // only push to local storage if the transaction is pending on chain
  // this is to prevent saving txns that have not been actually submitted to the blockchain
  if (txnIdx === -1 && txn.status === TxnStatus.PendingOnChain) {
    savedTxns.push(txn);
  } else {
    // otherwise update the transaction
    savedTxns[txnIdx] = txn;
  }
  localStorage.setItem('transactions', JSON.stringify(savedTxns));

  return savedTxns;
};

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
    setTransactionStatus: (
      state,
      action: PayloadAction<TransferCrucibleArgs>
    ) => {
      const {
        type,
        account,
        chainId,
        description,
        hash,
        status,
      } = action.payload;

      const currentTransaction =
        state.transactions.filter((txn) => txn.hash === hash)[0] || {};

      const updatedTransaction = {
        ...currentTransaction,
        type,
        status,
        chainId: chainId || currentTransaction.chainId,
        account: account || currentTransaction.account,
        description: description || currentTransaction.description,
        hash: hash || currentTransaction.hash,
      };

      if (hash || currentTransaction.hash) {
        state.transactions = updateLocalStorageSavedTransactions(
          updatedTransaction
        );
      }
    },
  },
});

export default transactionsSlice.reducer;
