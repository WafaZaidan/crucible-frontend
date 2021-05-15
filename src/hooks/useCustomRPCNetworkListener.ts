import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { injectedConnector } from '../config';

export function useCustomRPCNetworkListener() {
  const web3React = useWeb3React();
  const { active, error, activate } = web3React;

  useEffect(() => {
    // @ts-ignore
    const { ethereum } = window;
    if (ethereum && !active && !error) {
      // handles RPC reinitialization when user changes to custom network like Taichi
      // @ts-ignore
      const handleRPCisReady = (connectInfo) => {
        if (connectInfo?.chainId === '0x1') {
          activate(injectedConnector);
        }
      };

      ethereum.on('connect', handleRPCisReady);
      return () => {
        ethereum.removeListener('connect', handleRPCisReady);
      };
    }
    return undefined;
  }, [active, error, activate]);
}
