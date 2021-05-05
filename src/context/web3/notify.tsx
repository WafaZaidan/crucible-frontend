import React, { createContext, useContext, ReactNode } from 'react';
import { API as NotifyAPI } from 'bnc-notify';
import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { initNotify } from '../../config/notify';
import { networkName } from '../../utils/network';

type Transaction = {
  hash?: string;
};

type NotifyContextProps = {
  children: ReactNode;
};

type Web3ContextType = {
  monitorTx(hash: string, reload: () => void): Promise<void>;
};

const NotifyContext = createContext<Web3ContextType | undefined>(undefined);

const NotifyProvider = ({ children }: NotifyContextProps) => {
  const { chainId } = useWeb3React();
  const [notify, setNotify] = useState<NotifyAPI | undefined>(undefined);

  useEffect(() => {
    const notify = initNotify();
    setNotify(notify);
  }, []);

  async function monitorTx(hash: string, reload: () => void) {
    if (notify && chainId) {
      const { emitter } = notify.hash(hash);
      emitter.on('txPool', (transaction: Transaction) => {
        return {
          message: `Your transaction is pending, click <a href="https://${networkName(
            chainId
          ).toLowerCase()}.etherscan.io/tx/${
            transaction.hash
          }" rel="noopener noreferrer" target="_blank">here</a> for more info.`,
        };
      });

      emitter.on('txSent', console.log);
      // TODO: Can reload crucibles in txConfirmed callback
      emitter.on('txConfirmed', (tx) => {
        if (tx.hash === localStorage.getItem('inFlightSubscriptionHash')) {
          localStorage.setItem('inFlightSubscriptionHash', '');
        }
        if (reload) {
          setTimeout(reload, 5000);
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
    <NotifyContext.Provider
      value={{
        monitorTx,
      }}
    >
      {children}
    </NotifyContext.Provider>
  );
};

const useNotify = () => {
  const context = useContext(NotifyContext);
  if (context === undefined) {
    throw new Error('useNotify must be used within a NotifyProvider');
  }
  return context;
};

export { NotifyProvider, useNotify };
