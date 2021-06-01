import { TxnDetails, TxnStatus, TxnType, UseTransactions } from './types';
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
      transactionsSlice.actions.setTransactionStatus({
        ...updatedTx,
        type: updatedTx.type as TxnType,
        account: web3React.account as string,
        chainId: web3React.chainId as number,
      })
    );
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

    if (_mintCrucible.fulfilled.match(mintAction)) {
      reloadBalances();
      reloadCrucibles();
    }

    if (_mintCrucible.rejected.match(mintAction)) {
      toast({
        title: 'Minting failed',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });

      updateSavedTransaction({
        status: TxnStatus.Failed,
      });
    }
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

    if (_increaseLP.fulfilled.match(increaseLPAction)) {
      reloadBalances();
      reloadCrucibles();
    }

    if (_increaseLP.rejected.match(increaseLPAction)) {
      toast({
        title: 'Failed to increase LP',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });

      updateSavedTransaction({
        status: TxnStatus.Failed,
      });
    }
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

    if (_unsubscribeLP.fulfilled.match(unsubLpAction)) {
      reloadBalances();
      reloadCrucibles();
    }

    if (_unsubscribeLP.rejected.match(unsubLpAction)) {
      toast({
        title: 'Failed to unsubscribe LP',
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
    mintCrucible,
    increaseLP,
    unsubscribeLP,
  };
};
