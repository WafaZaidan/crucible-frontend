import { useAppDispatch, useAppSelector } from '../hooks';
import { transactionsSlice } from './reducer';
import { TxnDetails, TxnType, UseTransactions } from './types';

export const useTransactions = (): UseTransactions => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactions);

  const addTransactionToStore = (
    txnType: TxnType
    // txnObj: AddTxnActionPayload
  ) => dispatch(transactionsSlice.actions.addTransactionToStore(txnType));

  const updateTransaction = (txnObj: TxnDetails) =>
    dispatch(transactionsSlice.actions.updateTransaction(txnObj));

  const clearTransaction = (txnType: TxnType) =>
    dispatch(transactionsSlice.actions.clearTransaction(txnType));

  return {
    transactions,
    addTransactionToStore,
    updateTransaction,
    clearTransaction,
  };
};
