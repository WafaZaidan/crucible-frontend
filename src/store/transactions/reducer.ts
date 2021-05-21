import { createSlice } from '@reduxjs/toolkit';
import { useWeb3React } from '@web3-react/core';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import { useAppDispatch, useAppSelector } from '../hooks';
import { SLICE_NAME } from '../enum';
import {
  TransactionList,
  TxnState,
  TxnStatus,
  TxnType,
  UseTransactions,
} from './types';
import { transferCrucible as _transferCrucible } from './actions/transferCrucible';
import { useConfig } from '../config';
import { useNotify } from '../../context/transactions';

const filterTxns = (
  transactions: TxnState,
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

const defaultTransaction = {
  status: TxnStatus.Ready,
};

export const initialState: TxnState = {
  [TxnType.mint]: defaultTransaction,
  [TxnType.increaseStake]: defaultTransaction,
  [TxnType.transfer]: defaultTransaction,
  [TxnType.claim]: defaultTransaction,
  [TxnType.withdraw]: defaultTransaction,
};

export const transactionsSlice = createSlice({
  name: SLICE_NAME.TRANSACTIONS,
  initialState,
  reducers: {
    setTransactionStatus: (state, action) => {
      const { type, status, description, hash } = action.payload;
      const txnState = state[type as TxnType];

      state[type as TxnType] = {
        ...txnState,
        status,
        description: description || txnState.description,
        hash: hash || txnState.hash,
      };
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
    transactions,
    TxnStatus.PendingOnChain
  );
  const completedTransactions = filterTxns(transactions, TxnStatus.Mined);

  return {
    transactions,
    pendingTransactions,
    completedTransactions,
    transferCrucible,
  };
};

export default transactionsSlice.reducer;
