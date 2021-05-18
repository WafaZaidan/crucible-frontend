import useConfigVariables from '../hooks/useConfigVariables';
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
import { useTransactions } from '../store/transactions/useTransactions';
import {
  GetNetworkStats,
  GetOwnedCrucibles,
  GetTokenBalances,
  GetUniswapBalances,
  GetUserRewards,
  IncreaseStake,
  MintAndLock,
  TransferCrucible,
  UnstakeAndClaim,
  Withdraw,
} from './types';

const useContracts = () => {
  const config = useConfigVariables();
  const transactionActions = useTransactions();

  const injectConfigAndTxnHook = (fxn: any, ...args: any) =>
    fxn(config, transactionActions, ...args);

  const mintAndLock: MintAndLock = (...args) =>
    injectConfigAndTxnHook(_mintAndLock, ...args);

  const getNetworkStats: GetNetworkStats = (...args) =>
    injectConfigAndTxnHook(_getNetworkStats, ...args);

  const getUserRewards: GetUserRewards = (...args) =>
    injectConfigAndTxnHook(_getUserRewards, ...args);

  const increaseStake: IncreaseStake = (...args) =>
    injectConfigAndTxnHook(_increaseStake, ...args);

  const transferCrucible: TransferCrucible = (...args) =>
    injectConfigAndTxnHook(_transferCrucible, ...args);

  const getOwnedCrucibles: GetOwnedCrucibles = (...args) =>
    injectConfigAndTxnHook(_getOwnedCrucibles, ...args);

  const unstakeAndClaim: UnstakeAndClaim = (...args) =>
    injectConfigAndTxnHook(_unstakeAndClaim, ...args);

  const withdraw: Withdraw = (...args) =>
    injectConfigAndTxnHook(_withdraw, ...args);

  const getTokenBalances: GetTokenBalances = (...args) =>
    injectConfigAndTxnHook(_getTokenBalances, ...args);

  const getUniswapBalances: GetUniswapBalances = (...args) =>
    injectConfigAndTxnHook(_getUniswapBalances, ...args);

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
