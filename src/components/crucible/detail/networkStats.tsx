import React, { FC } from 'react';
import { Box, Flex, Grid, HStack, Spinner, StatGroup } from '@chakra-ui/react';
import { Crucible } from '../../../context/crucibles/crucibles';
import { config } from '../../../config/variables';
import dayjs from 'dayjs';
import { useCrucibles } from '../../../context/crucibles';
import { useLpStats } from '../../../context/lp';
// import { useNetworkStats } from '../../../context/network';
import StatCard from '../../shared/StatCard';
import { Tooltip } from '@chakra-ui/tooltip';
import formatNumber from '../../../utils/formatNumber';
import numberishToBigNumber from '../../../utils/numberishToBigNumber';
import getMultiplier from '../../../utils/getMultiplier';

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
  // const { networkStats } = useNetworkStats();
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
  // TODO this method is flawed because the inflation wasn't originally automatic and was delayed a few days one time
  const daysAgo: number = dayjs().diff(inflationStartTimestamp, 'day');
  const inflationRate = 1.01;
  const inflationPeriodsElapsed: number = Math.floor(daysAgo / 14);
  const initialSupply = 1000000;
  const totalSupply = initialSupply * inflationRate ** inflationPeriodsElapsed;
  const totalSupplyPreviousInflation =
    initialSupply * inflationRate ** (inflationPeriodsElapsed - 1);

  // Divide by 2 twice:
  // once because only half the inflation goes to the reward pool
  // twice again because this is weekly values, and inflation occurs every two weeks
  const weeklyRewardsRate = (totalSupply - initialSupply) / 2 / 2;
  const rewardsRateIncrease =
    (totalSupply - totalSupplyPreviousInflation) / 2 / 2;

  let marketCap;
  if (tokenBalances?.mistPrice) {
    marketCap = tokenBalances.mistPrice
      .mul(numberishToBigNumber(totalSupply))
      .div(getMultiplier());
  }

  if (!crucible) return <Spinner width={24} height={24} />;

  return (
    <Box p={4} bg='white' color='gray.800' borderRadius='xl'>
      <Grid
        gridGap={4}
        templateRows={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
        templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
      >
        <StatCard
          title='Market Cap'
          label={marketCap ? formatNumber.currency(marketCap) : '-'}
        />
        <StatCard
          title='Total Value Locked'
          label={
            lpStats?.totalVolume
              ? formatNumber.currency(lpStats.totalVolume)
              : '-'
          }
        />
        <StatCard title='Inflation Rate' label='1%' subLabel='Every 14 days' />
        <StatCard title='Rewards Programs' label='1' subLabel='MIST, ETH' />
        <StatCard
          title='Rewards Rate'
          label={`${formatNumber.tokenWhole(weeklyRewardsRate)} MIST / week`}
          subLabel={formatNumber.tokenWhole(rewardsRateIncrease)}
          arrowOnSubLabel
        />
        <Tooltip
          hasArrow
          label='Rewards multiplier increases from x1 to x10 over this period.'
          bg='gray.800'
          color='white'
          placement='top'
          offset={[0, 16]}
        >
          <Flex style={{ alignSelf: 'stretch' }}>
            <StatCard title='Reward Scaling Period' label='60 days' />
          </Flex>
        </Tooltip>
      </Grid>
    </Box>
  );
};

export default LpPerformance;
