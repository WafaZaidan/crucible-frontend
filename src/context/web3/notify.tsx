import * as React from 'react';
import { API as NotifyAPI } from 'bnc-notify';
import { useState, useEffect } from 'react';
import { initNotify } from '../../config/notify';
import { networkName } from '../../utils/network';
import { useWeb3 } from '.';

type Transaction = {
  hash?: string;
};

type NotifyContextProps = {
  children: React.ReactNode;
};

type Web3ContextType = {
  monitorTx(hash: string): Promise<void>;
};

const NotifyContext = React.createContext<Web3ContextType | undefined>(
  undefined
);

const NotifyProvider = ({ children }: NotifyContextProps) => {
  const { network } = useWeb3();
  const [notify, setNotify] = useState<NotifyAPI | undefined>(undefined);

  useEffect(() => {
    const notify = initNotify();
    setNotify(notify);
  }, []);

  async function monitorTx(hash: string) {
    if (notify && network) {
      const { emitter } = notify.hash(hash);
      emitter.on('txPool', (transaction: Transaction) => {
        return {
          message: `Your transaction is pending, click <a href="https://${networkName(
            network
          )}.etherscan.io/tx/${
            transaction.hash
          }" rel="noopener noreferrer" target="_blank">here</a> for more info.`,
        };
      });

      emitter.on('txSent', console.log);
      // TODO: Can reload crucibles in txConfirmed callback
      emitter.on('txConfirmed', console.log);
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
  const context = React.useContext(NotifyContext);
  if (context === undefined) {
    throw new Error('useNotify must be used within a NotifyProvider');
  }
  return context;
};

export { NotifyProvider, useNotify };
