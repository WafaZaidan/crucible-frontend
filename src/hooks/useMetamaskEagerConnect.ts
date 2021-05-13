import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { injectedConnector } from '../config';

export function useEagerConnect() {
  const { activate } = useWeb3React();

  useEffect(() => {
    injectedConnector.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injectedConnector);
      }
    });
  }, [activate]);
}
