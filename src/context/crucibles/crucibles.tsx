import { BigNumber } from 'ethers';
import { useWeb3 } from '../web3';
import React, { useState, useEffect } from 'react';
import { formatUnits } from 'ethers/lib/utils';
import { getTokenBalances } from '../../contracts/getTokenBalances';
import { getOwnedCrucibles } from '../../contracts/getOwnedCrucibles';
import { getUniswapBalances } from '../../contracts/getUniswapTokenBalances';
import {
  getUserRewards,
  calculateMistRewards,
  EtherRewards,
  Rewards,
} from '../../contracts/aludel';
import { GET_PAIR_HISTORY } from '../../queries/uniswap';
import { useLazyQuery } from '@apollo/client';
import { config } from '../../config/variables';

export type Crucible = {
  id: string;
  balance: string | any;
  lockedBalance: string;
  owner: string;
  cleanBalance: any;
  cleanLockedBalance: any;
  cleanUnlockedBalance?: any;
  mintTimestamp?: any;
  tokenRewards?: number;
  ethRewards?: number;
  mistPrice?: number;
  wethPrice?: number;
  totalLpSupply?: any;
  initialMistInLP?: any;
  initialEthInLP?: any;
  wethValue?: number;
  mistValue?: number;
};

type TokenBalances = {
  lpMistBalance: BigNumber;
  lpWethBalance: BigNumber;
  totalLpSupply: BigNumber;
  mistBalance: BigNumber;
  lpBalance: BigNumber;
  wethPrice: number;
  mistPrice: number;
  cleanMist: string;
  cleanLp: string;
};

type CruciblesProps = {
  children: React.ReactNode;
};

type CruciblesContextType = {
  isLoading: boolean;
  isRewardsLoading: boolean;
  crucibles: Crucible[];
  tokenBalances: TokenBalances | undefined;
  reloadCrucibles(): void;
};

const Crucibles = React.createContext<CruciblesContextType | undefined>(
  undefined
);

const CruciblesProvider = ({ children }: CruciblesProps) => {
  const { provider, wallet, address, network } = useWeb3();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRewardsLoading, setIsRewardsLoading] = useState<boolean>(true);
  const [refreshCrucibles, setRefreshCrucibles] = useState<boolean>(false);
  const [crucibles, setCrucibles] = useState<Crucible[]>([]);
  const [tokenBalances, setTokenBalances] = useState<TokenBalances | undefined>(
    undefined
  );
  const { pairAddress } = config;

  const [loadPairs, { data: pairData }] = useLazyQuery(
    GET_PAIR_HISTORY(
      pairAddress,
      // [1615464001, 1615264001]
      crucibles.length
        ? crucibles.map((crucible) => crucible.mintTimestamp / 1000)
        : [1615464000]
    )
  );
  useEffect(() => {
    if (pairData) {
      setCrucibles((crucibles) => {
        return crucibles!.map((crucible, i) => {
          let percentOfPool =
            crucible.cleanBalance / pairData[`pairDay${i}`][0].totalSupply;
          return {
            ...crucible,
            initialMistInLP:
              percentOfPool * pairData[`pairDay${i}`][0].reserve0,
            initialEthInLP: percentOfPool * pairData[`pairDay${i}`][0].reserve1,
            ratio:
              pairData[`pairHour${i}`][0].reserve0 /
              pairData[`pairHour${i}`][0].reserve1,
          };
        });
      });
    }
  }, [pairData]);

  useEffect(() => {
    setIsLoading(true);
    setIsRewardsLoading(true);
    if (provider && wallet && network && address) {
      const signer = provider?.getSigner();
      getTokenBalances(signer, address as string, network).then(
        (balances: any) => {
          setTokenBalances(balances);
        }
      );
    }
  }, [provider, wallet, network, address]);

  useEffect(() => {
    if (tokenBalances && provider && network) {
      setIsRewardsLoading(true);
      const signer = provider?.getSigner();
      getOwnedCrucibles(signer, provider)
        .then((ownedCrucibles: Crucible[]) => {
          const reformatted = ownedCrucibles.map((crucible) => ({
            ...crucible,
            cleanBalance: formatUnits(crucible.balance),
            cleanLockedBalance: formatUnits(crucible.lockedBalance),
            cleanUnlockedBalance: formatUnits(
              crucible.balance.sub(crucible.lockedBalance)
            ),
            mistPrice: tokenBalances.mistPrice,
            totalLpSupply: formatUnits(tokenBalances.totalLpSupply),
            wethPrice: tokenBalances.wethPrice,
            ...getUniswapBalances(
              crucible.balance,
              tokenBalances.lpMistBalance,
              tokenBalances.lpWethBalance,
              tokenBalances.totalLpSupply,
              tokenBalances.wethPrice,
              tokenBalances.mistPrice,
              network
            ),
          }));
          setCrucibles(reformatted);
          return getUserRewards(signer, ownedCrucibles);
        })
        .then((rewards) => {
          setIsLoading(false);
          if (!!crucibles && crucibles.length && network === 1) loadPairs();
          if (rewards?.length) {
            Promise.all<Rewards>(
              rewards.map((reward: EtherRewards) => {
                return new Promise((resolve, reject) => {
                  resolve(
                    calculateMistRewards(
                      signer,
                      Number(reward.currStakeRewards)
                    )
                  );
                });
              })
            ).then((calculatedRewards: Rewards[]) => {
              const cruciblesWithRewards = crucibles?.map((crucible, i) => {
                const calculatedReward = calculatedRewards[i];
                return {
                  ...crucible,
                  ...calculatedReward,
                };
              });
              cruciblesWithRewards && setCrucibles(cruciblesWithRewards);
              setIsRewardsLoading(false);
            });
          } else {
            setIsLoading(false);
            setIsRewardsLoading(false);
          }
        })
        .catch((e) => {
          console.error(e);
          setIsLoading(false);
          setIsRewardsLoading(false);
        });
      setRefreshCrucibles(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenBalances, provider, network, refreshCrucibles, loadPairs]);

  const reloadCrucibles = () => {
    setRefreshCrucibles(true);
  };

  return (
    <Crucibles.Provider
      value={{
        crucibles,
        isLoading,
        isRewardsLoading,
        tokenBalances,
        reloadCrucibles,
      }}
    >
      {children}
    </Crucibles.Provider>
  );
};

const useCrucibles = () => {
  const context = React.useContext(Crucibles);
  if (context === undefined) {
    throw new Error('useCrucibles must be used within a CruciblesProvider');
  }
  return context;
};

export { CruciblesProvider, useCrucibles };
