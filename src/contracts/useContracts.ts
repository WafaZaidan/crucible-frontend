import useConfigVariables from '../hooks/useConfigVariables';
import { BigNumber, Signer } from 'ethers';
import { CallbackArgs } from '../hooks/useContract';
import {
  getNetworkStats as _getNetworkStats,
  getUserRewards as _getUserRewards,
} from './aludel';
import _getOwnedCrucibles from './getOwnedCrucibles';
import _withdraw from './withdraw';
import _getTokenBalances from './getTokenBalances';
import _getUniswapBalances from './getUniswapTokenBalances';

import { Crucible } from '../context/crucibles';
import { ChainId } from '@uniswap/sdk';

const useContracts = () => {
  const {
    aludelAddress,
    crucibleFactoryAddress,
    lpTokenAddress,
    wethAddress,
    mistTokenAddress,
    rewardPool,
    daiAddress,
  } = useConfigVariables();

  const getNetworkStats = (signer: Signer) =>
    _getNetworkStats(aludelAddress, signer);

  const getUserRewards = (signer: any, crucibles: Crucible[]) =>
    _getUserRewards(
      aludelAddress,
      wethAddress,
      mistTokenAddress,
      rewardPool,
      signer,
      crucibles
    );

  const getOwnedCrucibles = (signer: any, provider: any) =>
    _getOwnedCrucibles(
      crucibleFactoryAddress,
      lpTokenAddress,
      aludelAddress,
      signer,
      provider
    );

  const withdraw = (
    signer: any,
    crucibleAddress: string,
    amount: BigNumber,
    callback: (args: CallbackArgs) => void
  ) => _withdraw(lpTokenAddress, signer, crucibleAddress, amount, callback);

  const getTokenBalances = (
    signer: Signer,
    walletAddress: string,
    chainId: ChainId
  ) =>
    _getTokenBalances(
      lpTokenAddress,
      mistTokenAddress,
      wethAddress,
      daiAddress,
      signer,
      walletAddress,
      chainId
    );

  const getUniswapBalances = (
    lpBalance: BigNumber,
    lpMistBalance: BigNumber,
    lpWethBalance: BigNumber,
    totalLpSupply: BigNumber,
    wethPrice: BigNumber,
    mistPrice: BigNumber,
    chainId: ChainId
  ) =>
    _getUniswapBalances(
      lpTokenAddress,
      mistTokenAddress,
      wethAddress,
      lpBalance,
      lpMistBalance,
      lpWethBalance,
      totalLpSupply,
      wethPrice,
      mistPrice,
      chainId
    );

  return {
    getNetworkStats,
    getUserRewards,
    getOwnedCrucibles,
    withdraw,
    getTokenBalances,
    getUniswapBalances,
  };
};

export default useContracts;
