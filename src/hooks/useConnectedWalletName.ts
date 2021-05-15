import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { injectedConnector, walletconnectConnector } from '../config';

export function useConnectedWalletName() {
  const { active, connector } = useWeb3React();

  return useMemo(() => {
    if (active) {
      if (connector === injectedConnector) {
        return 'Metamask';
      }
      if (connector === walletconnectConnector) {
        return 'WalletConnect';
      }
    }
    return null;
  }, [connector, active]);
}
