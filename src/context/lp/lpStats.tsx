import React, { ReactNode } from 'react';
import { useWeb3 } from '../web3';
import { useQuery } from '@apollo/client';
import { useState, createContext, useContext } from 'react';
import { GET_UNISWAP_MINTS, GET_TOTAL_VOLUME } from '../../queries/uniswap';
import { config } from '../../config/variables';

type LpStatsType = {
  deposits: [any];
  totalAmountUSD: number;
  totalMistDeposited: number;
  totalWethDeposited: number;
  initialWethPriceUSD?: number;
  initialMistPriceUSD?: number;
  totalVolume?: number;
};

type LpStatsContextType = {
  lpStats: LpStatsType | undefined;
  isLpStatsLoading: boolean;
};

type LpStatsProviderProps = {
  children: ReactNode;
};

const LpStats = createContext<LpStatsContextType | undefined>(undefined);

const LpStatsProvider = ({ children }: LpStatsProviderProps) => {
  const { address } = useWeb3();
  const [isLpStatsLoading, setIsLpStatsLoading] = useState<boolean>(true);
  const [lpStats, setLpStats] = useState<LpStatsType | undefined>(undefined);
  const { pairAddress } = config;

  const { error, data } = useQuery(GET_UNISWAP_MINTS, {
    variables: { userAddress: address },
    skip: !address, // Must have address to query uniswap LP's
  });
  const {
    loading: volumeLoading,
    error: volumeError,
    data: volumeData,
  } = useQuery(GET_TOTAL_VOLUME, {
    variables: { pairAddress: pairAddress },
    skip: !!lpStats?.totalVolume, // Must have address to query uniswap LP's
  });

  // Query price at time of first Uniswap LP deposit
  // const {
  //   error: pricesError,
  //   data: pricesData,
  // } = useQuery(GET_PRICES, {
  //   variables: {
  //     beforeTimestamp: Number(lpStats?.deposits[0]?.timestamp),
  //     afterTimestamp: Number(lpStats?.deposits[0]?.timestamp) - 24 * 60 * 60,
  //   },
  //   skip: !lpStats?.deposits[0], // User must have deposits in order to query prices
  // });
  // if (pricesError)
  //   console.error('Error fetching prices from subgraph', pricesError);

  // if (pricesData && !lpStats?.initialWethPriceUSD) {
  //   setLpStats((lpStats: any) => ({
  //     ...lpStats,
  //     initialWethPriceUSD: pricesData?.wethPriceUSD[0].priceUSD,
  //     initialMistPriceUSD: pricesData?.mistPriceUSD[0].priceUSD,
  //   }));
  //   setIsLpStatsLoading(false);
  // }
  // Handle errors
  if (error) console.error('Error fetching mints from subgraph', error);

  if (volumeError)
    console.error('Error fetching volume from subgraph', volumeError);
  if (volumeData) {
    setLpStats((prev: any) => {
      return {
        ...prev,
        totalVolume: volumeData.pairs.length
          ? Number(volumeData.pairs[0].reserveUSD)
          : 0,
      };
    });
  }
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
