import useConfigVariables from '../hooks/useConfigVariables';
import { BigNumber, providers, Signer } from 'ethers';
import { CallbackArgs } from '../hooks/useContract';
import _mintAndLock from './mintAndLock';
import {
  getNetworkStats as _getNetworkStats,
  getUserRewards as _getUserRewards,
} from './aludel';
import _increaseStake from './increaseStake';
import _transferCrucible from './transferCrucible';
import _getOwnedCrucibles from './getOwnedCrucibles';
import _unstakeAndClaim from './unstakeAndClaim';
import _withdraw from './withdraw';
import _getTokenBalances from './getTokenBalances';
import _getUniswapBalances from './getUniswapTokenBalances';

import { Crucible } from '../context/crucibles/crucibles';
import { ChainId } from '@uniswap/sdk';

const useContracts = () => {
  const {
    aludelAddress,
    crucibleFactoryAddress,
    lpTokenAddress,
    transmuterAddress,
    wethAddress,
    mistTokenAddress,
    rewardPool,
    daiAddress,
  } = useConfigVariables();

  const mintAndLock = (
    signer: Signer,
    provider: providers.Web3Provider,
    amount: BigNumber,
    callback: (args: CallbackArgs) => void
  ) =>
    _mintAndLock(
      aludelAddress,
      crucibleFactoryAddress,
      transmuterAddress,
      signer,
      provider,
      amount,
      callback
    );

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

  const increaseStake = (
    signer: any,
    crucibleAddress: string,
    amount: BigNumber,
    callback: (args: CallbackArgs) => void
  ) =>
    _increaseStake(
      aludelAddress,
      transmuterAddress,
      signer,
      crucibleAddress,
      amount,
      callback
    );

  const transferCrucible = (
    signer: any,
    id: string,
    to: string,
    callback: (args: CallbackArgs) => void
  ) => {
    _transferCrucible(crucibleFactoryAddress, signer, id, to, callback);
  };

  const getOwnedCrucibles = (signer: any, provider: any) =>
    _getOwnedCrucibles(
      crucibleFactoryAddress,
      lpTokenAddress,
      aludelAddress,
      signer,
      provider
    );

  const unstakeAndClaim = (
    signer: any,
    crucibleAddress: string,
    amount: BigNumber,
    callback: (args: CallbackArgs) => void
  ) =>
    _unstakeAndClaim(aludelAddress, signer, crucibleAddress, amount, callback);

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
    mintAndLock,
    getNetworkStats,
    getUserRewards,
    increaseStake,
    transferCrucible,
    getOwnedCrucibles,
    unstakeAndClaim,
    withdraw,
    getTokenBalances,
    getUniswapBalances,
  };
};

export default useContracts;
