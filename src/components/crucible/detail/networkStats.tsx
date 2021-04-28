import React, { FC } from 'react';
import { Box, HStack, Flex, StatGroup, Spinner } from '@chakra-ui/react';
import { Crucible } from '../../../context/crucibles/crucibles';
import { config } from '../../../config/variables';
import dayjs from 'dayjs';
import { commify } from 'ethers/lib/utils';
import { useCrucibles } from '../../../context/crucibles';
import { useLpStats } from '../../../context/lp';
import { useNetworkStats } from '../../../context/network';
import StatCard from '../../shared/StatCard';

const { inflationStartTimestamp } = config;

type Props = {
  crucible: Crucible;
};

// * APY once max multiplier is acheived
// * Chart
//     * Total Supply w/inflation
//     * Total Volume (of LP) Locked

const LpPerformance: FC<Props> = ({ crucible }) => {
  const { tokenBalances } = useCrucibles();
  const { lpStats } = useLpStats();
  const { networkStats } = useNetworkStats();
  // Get ether rewards rate
  // console.log('STARTPLUSDURATION', networkStats.start, networkStats.duration);
  // console.log(
  //   'DAYSLEFT',
  //   networkStats.shares,
  //   dayjs(networkStats.start * 1000 + networkStats.duration * 1000).diff(
  //     dayjs(),
  //     'day'
  //   )
  // );
  // let ethRewardsRate =
  //   (networkStats.shares /
  //     dayjs(networkStats.start * 1000 + networkStats.duration * 1000).diff(
  //       dayjs(),
  //       'day'
  //     )) *
  //   7;

  // console.log('ETH REWARDS RATE', ethRewardsRate);

  // Get rewards rate in MIST
  const daysAgo: number = dayjs().diff(inflationStartTimestamp, 'day');
  const inflationRate = 1.01;
  const inflationPeriodsElapsed: number = Math.floor(daysAgo / 14);
  const initialSupply = 1000000;
  const totalSupply = initialSupply * inflationRate ** inflationPeriodsElapsed;

  const weeklyRewardsRate = (totalSupply - initialSupply) / 2 / 2;
  const rewardsRateIncrease =
    weeklyRewardsRate -
    (initialSupply * inflationRate ** (inflationPeriodsElapsed - 1) -
      initialSupply) /
      2 /
      2;

  if (!crucible) return <Spinner width={24} height={24} />;

  return (
    <Box p={4} bg='white' color='gray.800' borderRadius='xl'>
      <Flex
        justifyContent='space-between'
        alignItems='start'
        direction='column'
      >
        <HStack width='100%' direction='row'>
          <StatGroup mt={4} alignItems='baseline' width='100%'>
            <StatCard
              title='Market Cap'
              label={
                tokenBalances?.mistPrice
                  ? `$${commify(
                      (tokenBalances?.mistPrice * totalSupply).toFixed(2)
                    )}`
                  : '$ -'
              }
            />
            <StatCard
              title='Total Volume Locked'
              label={`$${
                lpStats?.totalVolume
                  ? commify(lpStats.totalVolume.toFixed(2))
                  : 0
              }`}
            />
            <StatCard
              title='Inflation Rate'
              label='1%'
              subLabel='Every 14 days'
            />
          </StatGroup>
        </HStack>
        <HStack width='100%' direction='row'>
          <StatGroup mt={2} alignItems='baseline' width='100%'>
            <StatCard title='Rewards Programs' label='2' subLabel='MIST, ETH' />
            <StatCard
              title='Rewards Rate'
              label={`${commify(weeklyRewardsRate.toFixed(0))} MIST / week`}
              subLabel={`${commify(rewardsRateIncrease.toFixed(0))}`}
              arrowOnSubLabel
            />
            <StatCard title='Reward Scaling Period' label='60 days' />
          </StatGroup>
        </HStack>
      </Flex>
    </Box>
  );
};

export default LpPerformance;
