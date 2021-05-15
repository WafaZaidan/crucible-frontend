import { useAppDispatch, useAppSelector } from '../hooks';
import { transactionsSlice } from './reducer';
import { AddTxnActionPayload } from './types';

export const useTransactions = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactions);

  const addTransactionToQueue = (txn: AddTxnActionPayload) =>
    dispatch(transactionsSlice.actions.addTransactionToQueue(txn));
  return { transactions, addTransactionToQueue };
};
