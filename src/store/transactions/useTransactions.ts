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
import { useModal } from '../modals';

export const useTransactions = (): UseTransactions => {
  const dispatch = useAppDispatch();
  const { config } = useConfig();
  const web3React = useWeb3React();
  const { monitorTx } = useNotify();
  const { reloadBalances, reloadCrucibles } = useCrucibles();
  const configForNetwork = config[web3React.chainId || 1];
  const { transactions } = useAppSelector((state) => state.transactions);
  const toast = useToast();
  const modal = useModal();

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

  const resolveTransaction = (rawAction: any, dispatchedAction: any) => {
    if (rawAction.fulfilled.match(dispatchedAction)) {
      reloadBalances();
      reloadCrucibles();
    }

    // transfer failure
    if (rawAction.rejected.match(dispatchedAction)) {
      // generic error handling

      console.log(dispatchedAction);

      toast({
        title: 'Transaction Failed',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const actionArguments = {
    config: configForNetwork,
    web3React,
    monitorTx,
    updateTx: updateSavedTransaction,
    modal,
    toast,
  };

  const transferCrucible = async (crucibleId: string, transferTo: string) => {
    const transferAction = await dispatch(
      _transferCrucible({
        ...actionArguments,
        transferTo,
        crucibleId,
      })
    );
    resolveTransaction(_transferCrucible, transferAction);
  };

  const mintCrucible = async (amountLp: BigNumber) => {
    const mintAction = await dispatch(
      _mintCrucible({
        ...actionArguments,
        amountLp,
      })
    );
    resolveTransaction(_mintCrucible, mintAction);
  };

  const increaseLP = async (amountLp: BigNumber, crucibleAddress: string) => {
    const increaseLPAction = await dispatch(
      _increaseLP({
        ...actionArguments,
        amountLp,
        crucibleAddress,
      })
    );
    resolveTransaction(_increaseLP, increaseLPAction);
  };

  const unsubscribeLP = async (
    amountLp: BigNumber,
    crucibleAddress: string
  ) => {
    const unsubLpAction = await dispatch(
      _unsubscribeLP({
        ...actionArguments,
        amountLp,
        crucibleAddress,
      })
    );
    resolveTransaction(_unsubscribeLP, unsubLpAction);
  };

  const withdraw = async (amountLp: BigNumber, crucibleAddress: string) => {
    const withdrawAction = await dispatch(
      _withdraw({
        ...actionArguments,
        amountLp,
        crucibleAddress,
      })
    );
    resolveTransaction(_withdraw, withdrawAction);
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
