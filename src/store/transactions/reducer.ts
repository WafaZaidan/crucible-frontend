import { createSlice } from '@reduxjs/toolkit';
import { useWeb3React } from '@web3-react/core';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import { useAppDispatch, useAppSelector } from '../hooks';
import { SLICE_NAME } from '../enum';
import {
  CurrentTransactions,
  TransactionList,
  TxnDetails,
  TxnState,
  TxnStatus,
  TxnType,
  UseTransactions,
} from './types';
import { transferCrucible as _transferCrucible } from './actions/transferCrucible';
import { useConfig } from '../config';
import { useNotify } from '../../context/transactions';

const filterTxns = (
  transactions: CurrentTransactions,
  filterBy: TxnStatus
): TransactionList => {
  // @ts-ignore
  return _filter(
    _map(transactions, (txn, txnType) => {
      if (txn.status === filterBy) {
        return {
          type: txnType,
          ...txn,
        };
      }
    }),
    (txn) => txn !== undefined
  );
};

const updateLocalStorageSavedTransactions = (txn: TxnDetails) => {
  const savedTxns = JSON.parse(localStorage.getItem('transactions') || '[]');
  // @ts-ignore
  const txnIdx = savedTxns.findIndex((t) => t.hash === txn.hash);

  if (txnIdx === -1 && txn.status === TxnStatus.PendingOnChain) {
    savedTxns.push(txn);
  } else {
    savedTxns[txnIdx] = txn;
  }
  localStorage.setItem('transactions', JSON.stringify(savedTxns));
  return savedTxns;
};

const defaultTransaction = {
  status: TxnStatus.Ready,
};

export const initialState: TxnState = {
  current: {
    [TxnType.mint]: defaultTransaction,
    [TxnType.increaseStake]: defaultTransaction,
    [TxnType.transfer]: defaultTransaction,
    [TxnType.claim]: defaultTransaction,
    [TxnType.withdraw]: defaultTransaction,
  },
  saved: JSON.parse(localStorage.getItem('transactions') || '[]'),
};

export const transactionsSlice = createSlice({
  name: SLICE_NAME.TRANSACTIONS,
  initialState,
  reducers: {
    clearSavedTransactions: (state) => {
      console.log('clearing txs');
      localStorage.setItem('transactions', '[]');
      state.saved = [];
    },
    setTransactionStatus: (state, action) => {
      const transactions = state;
      const { type, status, description, hash } = action.payload;
      const currentTransaction = state.current[type as TxnType];
      const updatedTransaction = {
        ...currentTransaction,
        type,
        status,
        description: description || currentTransaction.description,
        hash: hash || currentTransaction.hash,
      };

      // save current transaction
      transactions.current[type as TxnType] = updatedTransaction;

      // save updated transaction
      if (hash || currentTransaction.hash) {
        console.log('saving a new tx to state: ', updatedTransaction);
        transactions.saved = updateLocalStorageSavedTransactions(
          updatedTransaction
        );
      }
    },
  },
});

export const useTransactions = (): UseTransactions => {
  const dispatch = useAppDispatch();
  const { config } = useConfig();
  const web3React = useWeb3React();
  const { monitorTx } = useNotify();
  const configForNetwork = config[web3React.chainId || 1];
  const transactions = useAppSelector((state) => state.transactions);

  const clearSavedTransactions = () => {
    dispatch(transactionsSlice.actions.clearSavedTransactions());
  };

  const transferCrucible = (crucibleId: string, transferTo: string) =>
    dispatch(
      _transferCrucible({
        config: configForNetwork,
        web3React,
        monitorTx,
        transferTo,
        crucibleId,
      })
    );

  const pendingTransactions = filterTxns(
    transactions.current,
    TxnStatus.PendingOnChain
  );

  const completedTransactions = filterTxns(
    transactions.current,
    TxnStatus.Mined
  );

  return {
    transactions,
    pendingTransactions,
    completedTransactions,
    clearSavedTransactions,
    transferCrucible,
  };
};

export default transactionsSlice.reducer;
