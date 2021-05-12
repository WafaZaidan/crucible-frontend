import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import config from '../config';

// @ts-ignore
const injected = new InjectedConnector({
  supportedChainIds: config.supportedNetworks,
});

export function useCustomRPCNetworkListener() {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    // @ts-ignore
    const { ethereum } = window;
    if (ethereum && !active && !error) {
      // handles RPC reinitialization when user changes to custom network like Taichi
      // @ts-ignore
      const handleRPCisReady = (connectInfo) => {
        if (connectInfo?.chainId === '0x1') {
          activate(injected);
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
