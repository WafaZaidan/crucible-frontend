import { TxnDetails, UseTransactions } from './types';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useConfig } from '../config';
import { useWeb3React } from '@web3-react/core';
import { useNotify } from '../../context/transactions';
import { useCrucibles } from '../../context/crucibles';
import { useToast } from '@chakra-ui/toast';
import { transferCrucible as _transferCrucible } from './actions/transferCrucible';
import { mintCrucible as _mintCrucible } from './actions/mintCrucible';
import { increaseLP as _increaseLP } from './actions/increaseLP';
import { unsubscribeLP as _unsubscribeLP } from './actions/unsubscribeLP';
import { withdraw as _withdraw } from './actions/withdrawLP';
import { transactionsSlice } from './reducer';
import { BigNumber } from 'ethers';

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

  const updateSavedTransaction = (updatedTx: Partial<TxnDetails>) => {
    dispatch(
      // @ts-ignore
      transactionsSlice.actions.setTransactionStatus({
        ...updatedTx,
        account: web3React.account as string,
        chainId: web3React.chainId as number,
      })
    );
  };

  const resolveTransaction = (
    rawAction: any,
    dispatchedAction: any,
    errorMessage: string
  ) => {
    if (rawAction.fulfilled.match(dispatchedAction)) {
      reloadBalances();
      reloadCrucibles();
    }

    // transfer failure
    if (rawAction.rejected.match(dispatchedAction)) {
      // generic error handling

      toast({
        title: errorMessage,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

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
    resolveTransaction(_transferCrucible, transferAction, 'Transfer Failed');
  };

  const mintCrucible = async (amountLp: BigNumber) => {
    const mintAction = await dispatch(
      _mintCrucible({
        config: configForNetwork,
        web3React,
        monitorTx,
        updateTx: updateSavedTransaction,
        amountLp,
      })
    );
    resolveTransaction(_mintCrucible, mintAction, 'Minting failed');
  };

  const increaseLP = async (amountLp: BigNumber, crucibleAddress: string) => {
    const increaseLPAction = await dispatch(
      _increaseLP({
        config: configForNetwork,
        web3React,
        monitorTx,
        updateTx: updateSavedTransaction,
        amountLp,
        crucibleAddress,
      })
    );
    resolveTransaction(_increaseLP, increaseLPAction, 'Failed to increase LP');
  };

  const unsubscribeLP = async (
    amountLp: BigNumber,
    crucibleAddress: string
  ) => {
    const unsubLpAction = await dispatch(
      _unsubscribeLP({
        config: configForNetwork,
        web3React,
        monitorTx,
        updateTx: updateSavedTransaction,
        amountLp,
        crucibleAddress,
      })
    );
    resolveTransaction(
      _unsubscribeLP,
      unsubLpAction,
      'Failed to unsubscribe LP'
    );
  };

  const withdraw = async (amountLp: BigNumber, crucibleAddress: string) => {
    const withdrawAction = await dispatch(
      _withdraw({
        config: configForNetwork,
        web3React,
        monitorTx,
        updateTx: updateSavedTransaction,
        amountLp,
        crucibleAddress,
      })
    );
    resolveTransaction(_withdraw, withdrawAction, 'Failed to withdraw');
  };

  const txnsByAccountAndNetwork = transactions.filter(
    (txn) =>
      txn.account === web3React.account && txn.chainId === web3React.chainId
  );

  return {
    transactions: txnsByAccountAndNetwork,
    clearSavedTransactions,
    transferCrucible,
    mintCrucible,
    increaseLP,
    unsubscribeLP,
    withdraw,
  };
};
