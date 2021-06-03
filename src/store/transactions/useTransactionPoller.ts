import { useCallback, useEffect } from 'react';
import { transactionsSlice } from './reducer';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { TxnStatus } from './types';
import { useTransactions } from './useTransactions';

const TX_POLL_INTERVAL = 1000 * 5; // 5 seconds

const useTransactionPoller = () => {
  const { transactions } = useTransactions();
  const { library } = useWeb3React();
  const dispatch = useDispatch();

  const checkTransactionStatuses = useCallback(async () => {
    transactions.forEach((txn) => {
      if (txn.hash && txn.status === TxnStatus.PendingOnChain) {
        library.getTransactionReceipt(txn.hash).then((receipt: any) => {
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
  }, [transactions]);

  useEffect(() => {
    let interval: number;
    if (library && transactions.length > 0) {
      checkTransactionStatuses();
      setInterval(() => checkTransactionStatuses(), TX_POLL_INTERVAL);
    }
    return () => clearInterval(interval);
  }, [library, transactions.length]);
};

export default useTransactionPoller;
