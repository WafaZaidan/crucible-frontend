import { useCallback, useEffect } from 'react';
import { transactionsSlice } from './reducer';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { TxnStatus } from './types';
import { useTransactions } from './useTransactions';

const useTransactionPoller = () => {
  const { savedTransactions } = useTransactions();
  const { library } = useWeb3React();
  const dispatch = useDispatch();

  const checkTransactionStatuses = useCallback(async () => {
    savedTransactions.forEach((txn) => {
      if (txn.hash) {
        library?.getTransactionReceipt(txn.hash).then((receipt: any) => {
          if (receipt) {
            dispatch(
              transactionsSlice.actions.setTransactionStatus({
                ...txn,
                account: txn.account as string,
                chainId: txn.chainId as number,
                status:
                  receipt.status === 1 ? TxnStatus.Mined : TxnStatus.Failed,
              })
            );
          }
        });
      }
    });
  }, [savedTransactions]);

  useEffect(() => {
    if (library && savedTransactions.length > 0) {
      checkTransactionStatuses();
    }
  }, [library, savedTransactions.length]);
};

export default useTransactionPoller;
