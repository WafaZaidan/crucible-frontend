import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { BigNumber } from 'ethers';
import { useWeb3 } from '../web3';
import { formatUnits } from 'ethers/lib/utils';
import { getTokenBalances } from '../../contracts/getTokenBalances';
import { getOwnedCrucibles } from '../../contracts/getOwnedCrucibles';
import { getUniswapBalances } from '../../contracts/getUniswapTokenBalances';
import {
  calculateMistRewards,
  EtherRewards,
  getUserRewards,
  Rewards,
} from '../../contracts/aludel';
import { GET_PAIR_HISTORY } from '../../queries/uniswap';
import { useLazyQuery } from '@apollo/client';
import { config } from '../../config/variables';

export type Stake = {
  amount: string;
  timestamp: number;
};

export type Crucible = {
  id: string;
  balance: string | any;
  lockedBalance: string;
  owner: string;
  cleanBalance: any;
  cleanLockedBalance: any;
  stakes: Stake[];
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
  children: ReactNode;
};

type CruciblesContextType = {
  isLoading: boolean;
  isRewardsLoading: boolean;
  crucibles: Crucible[] | undefined;
  tokenBalances: TokenBalances | undefined;
  reloadCrucibles(): void;
  reloadBalances(): void;
  cruciblesOnCurrentNetwork(): Promise<Crucible[]>;
};

const Crucibles = createContext<CruciblesContextType | undefined>(undefined);

const CruciblesProvider = ({ children }: CruciblesProps) => {
  const { provider, address, wallet, network } = useWeb3();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRewardsLoading, setIsRewardsLoading] = useState<boolean>(true);
  const [refreshCrucibles, setRefreshCrucibles] = useState<boolean>(false);
  const [refreshBalances, setRefreshBalances] = useState<boolean>(false);
  const [crucibles, setCrucibles] = useState<Crucible[]>();
  const [tokenBalances, setTokenBalances] = useState<TokenBalances | undefined>(
    undefined
  );
  const { pairAddress, networkId } = config;

  const [loadPairs, { data: pairData }] = useLazyQuery(
    GET_PAIR_HISTORY(
      pairAddress,
      // [1615464001, 1615264001]
      crucibles && crucibles.length
        ? crucibles.map((crucible) => crucible.mintTimestamp / 1000)
        : [1615464000]
    )
  );

  const reloadCrucibles = () => {
    setRefreshCrucibles(true);
  };
  const reloadBalances = () => {
    setRefreshBalances(true);
  };

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
    if (
      provider &&
      wallet &&
      address &&
      network &&
      network === Number(networkId)
    ) {
      const signer = provider?.getSigner();
      getTokenBalances(signer, address as string, network).then(
        (balances: any) => {
          setTokenBalances(balances);
        }
      );
    }
  }, [provider, wallet, network, address, refreshBalances]);

  useEffect(
    () => {
      let updatedCrucibles: Crucible[] = [];
      if (tokenBalances && provider && network) {
        // process.env.REACT_APP_NETWORK_ID

        const signer = provider.getSigner();
        setIsRewardsLoading(true);
        getOwnedCrucibles(signer, provider)
          .then((ownedCrucibles: Crucible[]) => {
            updatedCrucibles = ownedCrucibles.map((crucible) => ({
              ...crucible,
              cleanBalance: formatUnits(crucible.balance),
              cleanLockedBalance: formatUnits(crucible.lockedBalance),
              cleanUnlockedBalance: formatUnits(
                crucible.balance.sub(crucible.lockedBalance)
              ),
              mistPrice: tokenBalances!.mistPrice,
              totalLpSupply: formatUnits(tokenBalances!.totalLpSupply),
              wethPrice: tokenBalances!.wethPrice,
              ...getUniswapBalances(
                crucible.balance,
                tokenBalances!.lpMistBalance,
                tokenBalances!.lpWethBalance,
                tokenBalances!.totalLpSupply,
                tokenBalances!.wethPrice,
                tokenBalances!.mistPrice,
                network
              ),
            }));
            setCrucibles(updatedCrucibles);
            return getUserRewards(signer, ownedCrucibles);
          })
          .then((rewards) => {
            setIsLoading(false);
            if (
              !!updatedCrucibles &&
              updatedCrucibles.length &&
              network === 1
            ) {
              loadPairs();
            }

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
                const cruciblesWithRewards = updatedCrucibles?.map(
                  (crucible, i) => {
                    const calculatedReward = calculatedRewards[i];
                    return {
                      ...crucible,
                      ...calculatedReward,
                    };
                  }
                );

                if (cruciblesWithRewards) {
                  setCrucibles(cruciblesWithRewards);
                }
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [provider, address, network, refreshCrucibles, tokenBalances, loadPairs]
  );

  const cruciblesOnCurrentNetwork = async () => {
    const signer = provider?.getSigner();
    const ownedCrucibles = await getOwnedCrucibles(signer, provider);
    return ownedCrucibles;
  };

  return (
    <Crucibles.Provider
      value={{
        crucibles,
        isLoading,
        isRewardsLoading,
        tokenBalances,
        reloadCrucibles,
        reloadBalances,
        cruciblesOnCurrentNetwork,
      }}
    >
      {children}
    </Crucibles.Provider>
  );
};

const useCrucibles = () => {
  const context = useContext(Crucibles);
  if (context === undefined) {
    throw new Error('useCrucibles must be used within a CruciblesProvider');
  }
  return context;
};

export { CruciblesProvider, useCrucibles };
