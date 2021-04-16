import * as React from 'react';
import { useWeb3 } from '../web3';
import { useState, useEffect } from 'react';
import { getNetworkStats } from '../../contracts/aludel';

type NetworkStatsProps = {
  children: React.ReactNode;
};

type NetworkStatsContextType = {
  networkStats: any;
};

const NetworkStats = React.createContext<NetworkStatsContextType | undefined>(
  undefined
);

const NetworkStatsProvider = ({ children }: NetworkStatsProps) => {
  const { provider, wallet, address } = useWeb3();
  const [networkStats, setNetworkStats] = useState<any>(undefined);

  useEffect(() => {
    if (provider && wallet && address) {
      const signer = provider?.getSigner();
      getNetworkStats(signer).then(setNetworkStats);
    } else {
      setNetworkStats(undefined);
    }
  }, [provider, wallet, address]);

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
  const context = React.useContext(NetworkStats);
  if (context === undefined) {
    throw new Error(
      'useNetworkStats must be used within a NetworkStatsProvider'
    );
  }
  return context;
};

export { NetworkStatsProvider, useNetworkStats };
