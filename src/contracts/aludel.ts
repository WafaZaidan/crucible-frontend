import { BigNumber, ethers, Signer } from 'ethers';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import { aludelAbi } from '../abi/aludelAbi';
import { _abi } from '../interfaces/Erc20DetailedFactory';
import { Crucible } from '../context/crucibles/crucibles';

export interface EtherRewards {
  currStakeRewards: BigNumber;
  currVaultRewards: BigNumber;
  stakeRewardsIn30Days: BigNumber;
  vaultRewardsIn30Days: BigNumber;
  mistRewards: BigNumber;
  wethRewards: BigNumber;
}

export async function getNetworkStats(aludelAddress: string, signer: Signer) {
  const aludel = new ethers.Contract(aludelAddress, aludelAbi, signer);
  const [
    ,
    ,
    ,
    rewardScaling, // array of big numbers, floor ceiling time
    rewardSharesOutstanding,
    totalStake,
    totalStakeUnits,
    lastUpdate,
    rewardSchedules,
  ] = await aludel.getAludelData();

  const [floor, ceiling, time] = rewardScaling;
  const [duration, start, shares] = rewardSchedules[0];

  return {
    duration: duration.toNumber(),
    start: start.toNumber(),
    shares: formatEther(shares),
    weeklyEthRewardsRate: 0,
    floor: formatUnits(floor),
    ceiling: formatUnits(ceiling),
    time: formatUnits(time),
    rewardSharesOutstanding: formatUnits(rewardSharesOutstanding),
    totalStake: formatUnits(totalStake),
    totalStakeUnits: formatUnits(totalStakeUnits),
    lastUpdate: lastUpdate.toNumber(),
  };
}

// 1. (current rewards / available rewards) * (available eth / total eth) * total mist
// 2. Your portion of reward pool * fraction of eth pool currently unlocked * total mist
// 3. (Your staking units / Total units) * (getCurrentUnlockedRewards: Eth / total reward pool in Eth) * total mist

// Returns array with vault rewards (current and projected)
export async function getUserRewards(
  aludelAddress: string,
  wethAddress: string,
  mistTokenAddress: string,
  rewardPool: string,
  signer: any,
  crucibles: Crucible[]
): Promise<EtherRewards[]> {
  const plusOneMonth = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
  const aludelContract = new ethers.Contract(aludelAddress, aludelAbi, signer);
  const wethContract = new ethers.Contract(wethAddress, _abi, signer);
  const mistContract = new ethers.Contract(mistTokenAddress, _abi, signer);
  return Promise.all(
    crucibles.map(async (crucible: Crucible) => {
      const { id, lockedBalance } = crucible;
      const [
        currStakeRewards,
        currVaultRewards,
        stakeRewardsIn30Days,
        vaultRewardsIn30Days,
        totalWeiRewards,
        totalMistRewards,
      ] = await Promise.all([
        aludelContract.getCurrentStakeReward(id, lockedBalance),
        aludelContract.getCurrentVaultReward(id),
        aludelContract.getFutureStakeReward(id, lockedBalance, plusOneMonth),
        aludelContract.getFutureVaultReward(id, plusOneMonth),
        wethContract.balanceOf(rewardPool),
        mistContract.balanceOf(rewardPool),
      ]);
      const mistRewards = totalMistRewards
        .mul(currStakeRewards)
        .div(totalWeiRewards);
      const wethRewards = currStakeRewards;
      return {
        currStakeRewards,
        currVaultRewards,
        stakeRewardsIn30Days,
        vaultRewardsIn30Days,
        mistRewards,
        wethRewards,
      };
    })
  );
}
