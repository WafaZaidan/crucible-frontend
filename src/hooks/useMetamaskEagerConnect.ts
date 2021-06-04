import { useWeb3React } from '@web3-react/core';
import { injectedConnector } from '../config';
import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';

export function useEagerConnect() {
  const { activate } = useWeb3React();

  useEffect(() => {
    injectedConnector.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injectedConnector);
      }
    });
  }, [activate]);

  useEffect(() => {
    // @ts-ignore
    if (isMobile && window.ethereum) {
      activate(injectedConnector);
    }
  });
}
