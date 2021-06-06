import React, { createContext, useContext, ReactNode } from 'react';
import { API as NotifyAPI } from 'bnc-notify';
import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { initNotify } from '../../config/notify';
import useConfigVariables from '../../hooks/useConfigVariables';

type Transaction = {
  hash?: string;
};

type TransactionContextProps = {
  children: ReactNode;
};

type Web3ContextType = {
  monitorTx(hash: string, reload: () => void): Promise<void>;
};

const TransactionContext =
  createContext<Web3ContextType | undefined>(undefined);

const TransactionProvider = ({ children }: TransactionContextProps) => {
  const { chainId } = useWeb3React();
  const { blocknativeApiKey } = useConfigVariables();
  const [notify, setNotify] = useState<NotifyAPI | undefined>(undefined);

  useEffect(() => {
    const notify = initNotify(blocknativeApiKey, chainId);
    setNotify(notify);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  async function monitorTx(hash: string, reload: () => void) {
    const etherscanLink = (txHash = '') =>
      chainId === 1
        ? `https://etherscan.io/tx/${txHash}`
        : `https://rinkeby.etherscan.io/tx/${txHash}`;

    if (notify && chainId) {
      const { emitter } = notify.hash(hash);
      emitter.on('txPool', (transaction: Transaction) => {
        return {
          message: `Your transaction is pending, click <a href=${etherscanLink(
            transaction.hash
          )} rel="noopener noreferrer" target="_blank">here</a> for more info.`,
        };
      });

      emitter.on('txSent', console.log);
      // TODO: Can reload crucibles in txConfirmed callback
      emitter.on('txConfirmed', (tx) => {
        if (tx.hash === localStorage.getItem('inFlightSubscriptionHash')) {
          localStorage.setItem('inFlightSubscriptionHash', '');
        }
        if (reload) {
          reload();
        }
      });
      emitter.on('txSpeedUp', console.log);
      emitter.on('txCancel', console.log);
      emitter.on('txFailed', console.log);
    } else {
      console.log('Notify not initialized');
    }
  }

  return (
    <TransactionContext.Provider
      value={{
        monitorTx,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

const useNotify = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useNotify must be used within a TransactionProvider');
  }
  return context;
};

export { TransactionProvider, useNotify };
