import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch, useAppSelector } from '../hooks';
import { SLICE_NAME } from '../enum';
import {
  TxnDetails,
  TxnState,
  TxnStatus,
  TxnType,
  UseTransactions,
} from './types';
import {
  transferCrucible as _transferCrucible,
  TransferCrucibleArgs,
} from './actions/transferCrucible';
import { useConfig } from '../config';
import { useNotify } from '../../context/transactions';
import { useToast } from '@chakra-ui/toast';
import { useCrucibles } from '../../context/crucibles';

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
      localStorage.setItem('transactions', '[]');
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

export const useTransactions = (): UseTransactions => {
  const dispatch = useAppDispatch();
  const { config } = useConfig();
  const web3React = useWeb3React();
  const { monitorTx } = useNotify();
  const { reloadBalances, reloadCrucibles } = useCrucibles();
  const configForNetwork = config[web3React.chainId || 1];
  const { transactions } = useAppSelector((state) => state.transactions);
  const toast = useToast();

  const clearSavedTransactions = () => {
    dispatch(transactionsSlice.actions.clearSavedTransactions());
  };

  const updateSavedTransaction = (updatedTx: Partial<TxnDetails>) =>
    dispatch(
      transactionsSlice.actions.setTransactionStatus({
        ...updatedTx,
        type: TxnType.transfer,
        account: web3React.account as string,
        chainId: web3React.chainId as number,
      })
    );

  const transferCrucible = async (crucibleId: string, transferTo: string) => {
    const transferAction = await dispatch(
      _transferCrucible({
        config: configForNetwork,
        web3React,
        monitorTx,
        updateTx: updateSavedTransaction,
        transferTo,
        crucibleId,
      })
    );

    // transfer success
    if (_transferCrucible.fulfilled.match(transferAction)) {
      reloadBalances();
      reloadCrucibles();
    }

    // transfer failure
    if (_transferCrucible.rejected.match(transferAction)) {
      toast({
        title: 'Transfer failed',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });

      updateSavedTransaction({
        status: TxnStatus.Failed,
      });
    }
  };

  const pendingTransactions = transactions.filter(
    (txn) => txn.status === TxnStatus.PendingOnChain
  );

  const completedTransactions = transactions.filter(
    (txn) => txn.status === TxnStatus.Mined
  );

  const savedTransactions = transactions.filter(
    (txn) =>
      txn.account === web3React.account && txn.chainId === web3React.chainId
  );

  return {
    savedTransactions,
    pendingTransactions,
    completedTransactions,
    clearSavedTransactions,
    transferCrucible,
  };
};

export default transactionsSlice.reducer;
