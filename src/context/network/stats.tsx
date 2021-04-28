import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { useWeb3 } from '../web3';
import { getNetworkStats } from '../../contracts/aludel';

type NetworkStatsProps = {
  children: ReactNode;
};

type NetworkStatsContextType = {
  networkStats: any;
};

const NetworkStats = createContext<NetworkStatsContextType | undefined>(
  undefined
);

const NetworkStatsProvider = ({ children }: NetworkStatsProps) => {
  const { provider, wallet, address, network } = useWeb3();
  const [networkStats, setNetworkStats] = useState<any>(undefined);

  useEffect(() => {
    if (
      provider &&
      wallet &&
      address &&
      network === process.env.REACT_APP_NETWORK_ID
    ) {
      const signer = provider?.getSigner();
      getNetworkStats(signer).then(setNetworkStats);
    } else {
      setNetworkStats(undefined);
    }
  }, [provider, wallet, address, network]);

  return (
    <NetworkStats.Provider
      value={{
        networkStats,
      }}
    >
      {children}
    </NetworkStats.Provider>
  );
};

const useNetworkStats = () => {
  const context = useContext(NetworkStats);
  if (context === undefined) {
    throw new Error(
      'useNetworkStats must be used within a NetworkStatsProvider'
    );
  }
  return context;
};

export { NetworkStatsProvider, useNetworkStats };
