import React, { FC, useState } from 'react';
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/layout';
import { Progress, StatGroup } from '@chakra-ui/react';
import { Crucible } from '../../../context/crucibles/crucibles';
import { Button } from '@chakra-ui/button';
import dayjs from 'dayjs';
import UnstakeAndClaimModal from '../../modals/unstakeAndClaimModal';
import IncreaseStakeModal from '../../modals/increaseStakeModal';
import WithdrawModal from '../../modals/withdrawModal';
import StatCard from '../../shared/StatCard';
import formatNumber from '../../../utils/formatNumber';
import getMultiplier from '../../../utils/getMultiplier';

type Props = {
  crucible: Crucible;
};
const Rewards: FC<Props> = ({ crucible }) => {
  const [claimRewardsModalOpen, setClaimRewardsModalOpen] = useState(false);
  const [increaseStakeModalOpen, setIncreaseStakeModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  let mistRewardsUsd;
  let wethRewardsUsd;
  let aggregateRewardsUsd;
  let lpUsd;
  let totalUsd;

  const {
    mistRewards,
    wethRewards,
    mistPrice,
    wethPrice,
    currentWethInLp,
    currentMistInLp,
  } = crucible;

  if (
    mistRewards &&
    wethRewards &&
    mistPrice &&
    wethPrice &&
    currentWethInLp &&
    currentMistInLp
  ) {
    mistRewardsUsd = mistRewards.mul(mistPrice).div(getMultiplier());
    wethRewardsUsd = wethRewards.mul(wethPrice).div(getMultiplier());
    aggregateRewardsUsd = mistRewardsUsd.add(wethRewardsUsd);

    const currentMistInLpUsd = currentMistInLp
      .mul(mistPrice)
      .div(getMultiplier());
    const currentWethInLpUsd = currentWethInLp
      .mul(wethPrice)
      .div(getMultiplier());
    lpUsd = currentMistInLpUsd.add(currentWethInLpUsd);
    totalUsd = lpUsd.add(aggregateRewardsUsd);
  }

  return (
    <Box p={4} bg='white' color='gray.800' borderRadius='xl'>
      <Flex justifyContent='space-between' alignItems='start'>
        <HStack width='100%'>
          <Box flexGrow={1} textAlign='left'>
            <HStack justifyContent='start' direction='row'>
              <HStack justifyContent='center' pt={4}>
                <Text>Total Value</Text>
                <Text fontWeight='bold' mr={4} fontSize='lg'>
                  {totalUsd ? formatNumber.currency(totalUsd) : '-'}
                </Text>
              </HStack>
              <HStack justifyContent='center' pt={4}>
                <Text>LP Value</Text>
                <Text fontWeight='bold' mr={4} fontSize='lg'>
                  {lpUsd ? formatNumber.currency(lpUsd) : '-'}
                </Text>
              </HStack>
              <HStack justifyContent='center' pt={4}>
                <Text>Rewards</Text>
                <Text fontWeight='bold' mr={4} fontSize='lg'>
                  {aggregateRewardsUsd
                    ? formatNumber.currency(aggregateRewardsUsd)
                    : '-'}
                </Text>
              </HStack>
            </HStack>

            <HStack>
              <StatGroup mt={5} alignItems='baseline' width='100%'>
                <StatCard
                  title='Earned MIST Rewards'
                  label={mistRewards ? formatNumber.token(mistRewards) : '-'}
                  subLabel={
                    mistRewardsUsd ? formatNumber.currency(mistRewardsUsd) : '-'
                  }
                  arrowOnSubLabel
                />
                <StatCard
                  title='Earned ETH Rewards'
                  label={wethRewards ? formatNumber.token(wethRewards) : '-'}
                  subLabel={
                    wethRewardsUsd ? formatNumber.currency(wethRewardsUsd) : '-'
                  }
                  arrowOnSubLabel
                />
              </StatGroup>
            </HStack>

            <VStack width='100%' align='stretch' mt={6}>
              <Box>
                <Text fontSize='sm' pb={1}>
                  Reward Scaling Period
                </Text>
                <VStack>
                  {crucible!.stakes.map((stake, i) => {
                    const daysAgo: number = dayjs().diff(
                      stake.timestamp * 1000,
                      'day'
                    );
                    const secondsAgo: number = dayjs().diff(
                      stake.timestamp * 1000,
                      'second'
                    );
                    const secondsMax = 60 * 24 * 60 * 60;
                    const progress = Math.min(secondsAgo / secondsMax, 1);

                    const subscribedAt: string = formatNumber.date(
                      stake.timestamp * 1000
                    ); // dayjs(stake.timestamp).format('DD-MMM-YY');

                    return (
                      <Box key={i} width='100%'>
                        <Text fontSize='xs' pt={1} pb={2}>
                          Subscription {i + 1}:{' '}
                          {formatNumber.token(stake.amount)} LP ({subscribedAt})
                        </Text>
                        <Progress
                          value={progress * 100}
                          size='xs'
                          colorScheme='purple'
                          backgroundColor='lightgray'
                        />
                        <Text fontSize='xs' pt={1} pb={4}>
                          {formatNumber.percent(progress)} Complete ({daysAgo}{' '}
                          of 60 Days to max reward multiplier)
                        </Text>
                      </Box>
                    );
                  })}
                </VStack>
                <HStack>
                  <Text fontSize='sm'>
                    Subscribed Crucible LP:{' '}
                    <strong>
                      {formatNumber.token(crucible.lockedBalance)}
                    </strong>
                  </Text>
                  <Text fontSize='sm'>
                    Unsubscribed Crucible LP:{' '}
                    <strong>
                      {formatNumber.token(crucible.unlockedBalance)}
                    </strong>
                  </Text>
                </HStack>
              </Box>
            </VStack>

            <HStack width='100%' justifyContent='space-between' pt={6}>
              <Flex
                justifyContent='space-between'
                alignItems='center'
                width='100%'
              >
                <Button
                  width='100%'
                  marginRight='4px'
                  onClick={() => setIncreaseStakeModalOpen(true)}
                >
                  <Text fontSize='md'>Increase LP subscription</Text>
                </Button>
                <Button
                  width='100%'
                  disabled={crucible.lockedBalance.isZero()}
                  onClick={() => setClaimRewardsModalOpen(true)}
                >
                  <Text fontSize='md'>Claim rewards and unsubscribe</Text>
                </Button>
              </Flex>
            </HStack>

            <VStack justifyContent='center' pt={4}>
              <Button
                width='100%'
                disabled={crucible.unlockedBalance.lte(0)}
                onClick={() => setWithdrawModalOpen(true)}
              >
                <Text fontSize='md'>Withdraw unsubscribed LP</Text>
              </Button>
              {crucible.unlockedBalance.lte(0) && (
                <Text fontSize='sm' color='gray.400'>
                  To withdraw, first unsubscribe your LP
                </Text>
              )}
            </VStack>
          </Box>
        </HStack>
      </Flex>
      {claimRewardsModalOpen && (
        <UnstakeAndClaimModal
          crucible={crucible}
          onClose={() => setClaimRewardsModalOpen(false)}
        />
      )}
      {increaseStakeModalOpen && (
        <IncreaseStakeModal
          crucible={crucible}
          onClose={() => setIncreaseStakeModalOpen(false)}
        />
      )}
      {withdrawModalOpen && (
        <WithdrawModal
          crucible={crucible}
          onClose={() => setWithdrawModalOpen(false)}
        />
      )}
    </Box>
  );
};

export default Rewards;
