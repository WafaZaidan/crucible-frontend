import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { BigNumber } from 'ethers';
import { useWeb3 } from '../web3';
import { getTokenBalances } from '../../contracts/getTokenBalances';
import { getOwnedCrucibles } from '../../contracts/getOwnedCrucibles';
import { getUniswapBalances } from '../../contracts/getUniswapTokenBalances';
import { getUserRewards } from '../../contracts/aludel';
import { GET_PAIR_HISTORY } from '../../queries/uniswap';
import { useLazyQuery } from '@apollo/client';
import { config } from '../../config/variables';
import numberishToBigNumber from '../../utils/numberishToBigNumber';

export type Stake = {
  amount: BigNumber;
  timestamp: number;
};

export type Crucible = {
  id: string;
  owner: string;
  balance: BigNumber;
  lockedBalance: BigNumber;
  unlockedBalance: BigNumber;
  stakes: Stake[];
  mintTimestamp: number;
  mistRewards?: BigNumber;
  wethRewards?: BigNumber;
  mistPrice?: BigNumber;
  wethPrice?: BigNumber;
  totalLpSupply?: BigNumber;
  initialMistInLP?: BigNumber;
  initialEthInLP?: BigNumber;
  currentWethInLp?: BigNumber;
  currentMistInLp?: BigNumber;
};

type TokenBalances = {
  lpMistBalance: BigNumber;
  lpWethBalance: BigNumber;
  totalLpSupply: BigNumber;
  mistBalance: BigNumber;
  lpBalance: BigNumber;
  wethPrice: BigNumber;
  mistPrice: BigNumber;
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
        ? crucibles.map((crucible) => crucible.mintTimestamp)
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
          // TODO This whole thing breaks down with multiple LP subscriptions in a single crucible
          const { totalSupply, reserve0, reserve1 } = pairData[
            `pairDay${i}`
          ][0];
          const initialMistInLP = crucible.balance
            .mul(numberishToBigNumber(reserve0))
            .div(numberishToBigNumber(totalSupply));
          const initialEthInLP = crucible.balance
            .mul(numberishToBigNumber(reserve1))
            .div(numberishToBigNumber(totalSupply));
          return {
            ...crucible,
            initialMistInLP,
            initialEthInLP,
            // ratio:
            //   pairData[`pairHour${i}`][0].reserve0 /
            //   pairData[`pairHour${i}`][0].reserve1
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
        (balances: TokenBalances) => {
          setTokenBalances(balances);
        }
      );
    }
  }, [provider, wallet, network, networkId, address, refreshBalances]);

  useEffect(
    () => {
      let updatedCrucibles: Crucible[] = [];
      if (tokenBalances && provider && network) {
        // process.env.REACT_APP_NETWORK_ID

        const signer = provider.getSigner();
        setIsRewardsLoading(true);
        getOwnedCrucibles(signer, provider)
          .then((ownedCrucibles: Crucible[]) => {
            const { mistPrice, totalLpSupply, wethPrice } = tokenBalances;
            updatedCrucibles = ownedCrucibles.map((crucible) => ({
              ...crucible,
              mistPrice,
              totalLpSupply,
              wethPrice,
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
            if (updatedCrucibles && updatedCrucibles.length && network === 1) {
              loadPairs();
            }

            if (rewards?.length) {
              const cruciblesWithRewards = updatedCrucibles?.map(
                (crucible, i) => {
                  const { mistRewards, wethRewards } = rewards[i];
                  return {
                    ...crucible,
                    mistRewards,
                    wethRewards,
                  };
                }
              );
              if (cruciblesWithRewards) {
                setCrucibles(cruciblesWithRewards);
              }
            } else {
              setIsLoading(false);
            }
            setIsRewardsLoading(false);
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

  const cruciblesOnCurrentNetwork = () => {
    const signer = provider?.getSigner();
    return getOwnedCrucibles(signer, provider);
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
