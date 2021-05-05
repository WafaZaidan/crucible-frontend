import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { useWeb3React } from '@web3-react/core';
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
  const { library, account, chainId } = useWeb3React();
  const [networkStats, setNetworkStats] = useState<any>(undefined);

  useEffect(() => {
    if (library && account && chainId === process.env.REACT_APP_NETWORK_ID) {
      const signer = library?.getSigner();
      getNetworkStats(signer).then(setNetworkStats);
    } else {
      setNetworkStats(undefined);
    }
  }, [library, account, chainId]);

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
