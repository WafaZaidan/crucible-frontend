import { useWeb3 } from '../web3';
import { useQuery } from '@apollo/client';
import { useState, createContext, useContext } from 'react';
import { GET_PRICES, GET_UNISWAP_MINTS } from '../../queries/uniswap';

type LpStatsType = {
  deposits: [any];
  totalAmountUSD: number;
  totalMistDeposited: number;
  totalWethDeposited: number;
  initialWethPriceUSD?: number;
  initialMistPriceUSD?: number;
};

type LpStatsContextType = {
  lpStats: LpStatsType | undefined;
  isLpStatsLoading: boolean;
};

type LpStatsProviderProps = {
  children: React.ReactNode;
};

const LpStats = createContext<LpStatsContextType | undefined>(undefined);

const LpStatsProvider = ({ children }: LpStatsProviderProps) => {
  const { address } = useWeb3();
  const [isLpStatsLoading, setIsLpStatsLoading] = useState<boolean>(true);
  const [lpStats, setLpStats] = useState<LpStatsType | undefined>(undefined);

  const { loading, error, data } = useQuery(GET_UNISWAP_MINTS, {
    variables: { userAddress: address },
    skip: !address, // Must have address to query uniswap LP's
  });

  // Query price at time of first Uniswap LP deposit
  const {
    // loading: pricesLoading,
    error: pricesError,
    data: pricesData,
  } = useQuery(GET_PRICES, {
    variables: {
      beforeTimestamp: Number(lpStats?.deposits[0]?.timestamp),
      afterTimestamp: Number(lpStats?.deposits[0]?.timestamp) - 24 * 60 * 60,
    },
    skip: !lpStats?.deposits[0], // User must have deposits in order to query prices
  });

  // Handle errors
  if (error) console.error('Error fetching mints from subgraph', error);
  if (pricesError)
    console.error('Error fetching prices from subgraph', pricesError);

  if (data && !lpStats) {
    let totalAmountUSD = 0;
    let totalMistDeposited = 0;
    let totalWethDeposited = 0;
    let allDeposits =
      data.mints?.length &&
      data.mints.map((mint: any) => {
        totalAmountUSD += Number(mint.amountUSD);
        totalMistDeposited += Number(mint.amount0);
        totalWethDeposited += Number(mint.amount1);
        return {
          ...mint,
          mistAmount: mint.amount0,
          lpAmount: mint.amount1,
        };
      });
    setLpStats({
      deposits: allDeposits,
      totalAmountUSD,
      totalMistDeposited,
      totalWethDeposited,
    });
  }

  if (pricesData && !lpStats?.initialWethPriceUSD) {
    setLpStats((lpStats: any) => ({
      ...lpStats,
      initialWethPriceUSD: pricesData?.wethPriceUSD[0].priceUSD,
      initialMistPriceUSD: pricesData?.mistPriceUSD[0].priceUSD,
    }));
    setIsLpStatsLoading(false);
  }

  return (
    <LpStats.Provider
      value={{
        lpStats,
        isLpStatsLoading,
      }}
    >
      {children}
    </LpStats.Provider>
  );
};

const useLpStats = () => {
  const context = useContext(LpStats);
  if (context === undefined) {
    throw new Error('useLpStats must be used within a LpStatsProvider');
  }
  return context;
};

export { LpStatsProvider, useLpStats };
