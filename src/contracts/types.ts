import { BigNumber, providers, Signer } from 'ethers';
import { CallbackArgs } from '../hooks/useContract';
import { Crucible, TokenBalances } from '../context/crucibles';
import { EtherRewards } from './aludel';
import { ChainId } from '@uniswap/sdk';

export type MintAndLock = (
  signer: Signer,
  provider: providers.Web3Provider,
  amount: BigNumber,
  callback: (args: CallbackArgs) => void
) => void;

export type GetNetworkStats = (
  signer: Signer
) => Promise<{
  duration: number;
  start: number;
  shares: string;
  weeklyEthRewardsRate: number;
  floor: string;
  ceiling: string;
  time: string;
  rewardSharesOutstanding: string;
  totalStake: string;
  totalStakeUnits: string;
  lastUpdate: number;
}>;

export type GetUserRewards = (
  signer: Signer,
  crucibles: Crucible[]
) => Promise<EtherRewards[]>;

export type IncreaseStake = (
  signer: any,
  crucibleAddress: string,
  amount: BigNumber,
  callback: (args: CallbackArgs) => void
) => void;

export type TransferCrucible = (
  signer: any,
  id: string,
  to: string,
  callback: (args: CallbackArgs) => void
) => void;

export type GetOwnedCrucibles = (
  signer: any,
  provider: any
) => Promise<Crucible[]>;

export type UnstakeAndClaim = (
  signer: any,
  crucibleAddress: string,
  amount: BigNumber,
  callback: (args: CallbackArgs) => void
) => void;

export type Withdraw = (
  signer: any,
  crucibleAddress: string,
  amount: BigNumber,
  callback: (args: CallbackArgs) => void
) => void;

export type GetTokenBalances = (
  signer: Signer,
  walletAddress: string,
  chainId: ChainId
) => Promise<TokenBalances>;

export type GetUniswapBalances = (
  lpBalance: BigNumber,
  lpMistBalance: BigNumber,
  lpWethBalance: BigNumber,
  totalLpSupply: BigNumber,
  wethPrice: BigNumber,
  mistPrice: BigNumber,
  chainId: ChainId
) => { currentMistInLp: BigNumber; currentWethInLp: BigNumber };
