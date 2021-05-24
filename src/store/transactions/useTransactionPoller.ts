import { useCallback, useEffect } from 'react';
import { transactionsSlice, useTransactions } from './reducer';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { TxnStatus } from './types';

const TX_POLL_INTERVAL = 10000; // 10 seconds

const useTransactionPoller = () => {
  const { transactions } = useTransactions();
  const { library } = useWeb3React();
  const dispatch = useDispatch();
  const checkTransactionStatuses = useCallback(async () => {
    if (library) {
      transactions.saved.forEach((txn) => {
        library.getTransactionReceipt(txn.hash).then((receipt: any) => {
          if (receipt) {
            dispatch(
              transactionsSlice.actions.setTransactionStatus({
                ...txn,
                status:
                  receipt.status === 1 ? TxnStatus.Mined : TxnStatus.Failed,
              })
            );
          } else {
            console.log('no reciept?');
            // pending on chain?
          }
        });
      });
    }
  }, [transactions.saved, library]);

  useEffect(() => {
    // @ts-ignore
    let interval;
    if (library) {
      checkTransactionStatuses();
      setInterval(checkTransactionStatuses, TX_POLL_INTERVAL);
    }
    // @ts-ignore
    return () => clearInterval(interval);
  }, [library]);
};

export default useTransactionPoller;
