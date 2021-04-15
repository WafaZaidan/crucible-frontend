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

export type Crucible = {
  id: string;
  balance: string | any;
  lockedBalance: string;
  owner: string;
  cleanBalance?: string;
  cleanLockedBalance?: string;
  cleanUnlockedBalance?: any;
  mintTimestamp?: any;
  tokenRewards?: any;
  etherRewards?: any;
  mistPrice?: number;
  wethPrice?: number;
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
  crucibles: Crucible[] | undefined;
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
  const [crucibles, setCrucibles] = useState<Crucible[]>();
  const [tokenBalances, setTokenBalances] = useState<TokenBalances | undefined>(
    undefined
  );

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
    } else {
      setCrucibles(undefined);
      setTokenBalances(undefined);
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
          setIsLoading(false);
          return getUserRewards(signer, ownedCrucibles);
        })
        .then((rewards) => {
          if (rewards?.length) {
            Promise.all<Rewards>(
              rewards.map((reward: EtherRewards) => {
                return new Promise((resolve, reject) => {
                  resolve(
                    calculateMistRewards(signer, reward.currStakeRewards)
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
          console.log(e);
          setIsLoading(false);
          setIsRewardsLoading(false);
        });
      setRefreshCrucibles(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenBalances, provider, network, refreshCrucibles]);

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
