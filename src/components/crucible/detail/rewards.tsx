import React, { FC, useMemo, useState } from 'react';
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/layout';
import { Progress, StatGroup } from '@chakra-ui/react';
import { Crucible } from '../../../context/crucibles/crucibles';
import { Button } from '@chakra-ui/button';
import dayjs from 'dayjs';
import { commify } from 'ethers/lib/utils';
import UnstakeAndClaimModal from '../../modals/unstakeAndClaimModal';
import IncreaseStakeModal from '../../modals/increaseStakeModal';
import WithdrawModal from '../../modals/withdrawModal';
import StatCard from '../../shared/StatCard';

type Props = {
  crucible: Crucible;
};
const Rewards: FC<Props> = ({ crucible }) => {
  const [claimRewardsModalOpen, setClaimRewardsModalOpen] = useState(false);
  const [increaseStakeModalOpen, setIncreaseStakeModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const daysAgo: number = dayjs().diff(crucible.mintTimestamp, 'day');
  let aggregateRewardsUSD: number = 0;
  let lpValueUSD: number = 0;

  if (
    crucible.tokenRewards &&
    crucible.ethRewards &&
    crucible.mistPrice &&
    crucible.wethPrice &&
    crucible.wethValue &&
    crucible.mistValue
  ) {
    aggregateRewardsUSD =
      crucible.ethRewards * crucible.wethPrice +
      crucible.tokenRewards * crucible.mistPrice;
    lpValueUSD =
      crucible.mistValue * crucible.mistPrice +
      crucible.wethValue * crucible.wethPrice;
  }

  const earnedRewards: {
    mist: number | string;
    mistUsd: number | string;
    eth: number | string;
    ethUsd: number | string;
  } = useMemo(() => {
    const { tokenRewards, mistPrice, ethRewards, wethPrice } = crucible;
    const mist = tokenRewards ? +tokenRewards.toFixed(4) : 0;
    const mistUsd = mistPrice ? mist * mistPrice : '--';
    const eth = ethRewards ? +ethRewards.toFixed(4) : 0;
    const ethUsd = wethPrice ? commify((eth * wethPrice).toFixed(0)) : '--';

    return { mist, mistUsd, eth, ethUsd };
  }, [crucible]);

  return (
    <Box p={4} bg='white' color='gray.800' borderRadius='xl'>
      <Flex justifyContent='space-between' alignItems='start'>
        <HStack width='100%'>
          <Box flexGrow={1} textAlign='left'>
            <HStack justifyContent='start' direction='row'>
              <HStack justifyContent='center' pt={4}>
                <Text>Total Value</Text>
                <Text fontWeight='bold' mr={4} fontSize='lg'>
                  {`$${commify((lpValueUSD + aggregateRewardsUSD).toFixed(0))}`}
                </Text>
              </HStack>
              <HStack justifyContent='center' pt={4}>
                <Text>LP Value</Text>
                <Text fontWeight='bold' mr={4} fontSize='lg'>
                  {`$${commify(lpValueUSD?.toFixed(0))}`}
                </Text>
              </HStack>
              <HStack justifyContent='center' pt={4}>
                <Text>Rewards</Text>
                <Text fontWeight='bold' mr={4} fontSize='lg'>
                  {`$${commify(aggregateRewardsUSD?.toFixed(0))}`}
                </Text>
              </HStack>
            </HStack>

            <HStack>
              <StatGroup mt={5} alignItems='baseline' width='100%'>
                <StatCard
                  title='Earned MIST Rewards'
                  label={earnedRewards.mist.toString()}
                  subLabel={`$${earnedRewards.mistUsd}`}
                  arrowOnSubLabel
                />
                <StatCard
                  title='Earned ETH Rewards'
                  label={earnedRewards.eth.toString()}
                  subLabel={`$${earnedRewards.ethUsd}`}
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
                  <Progress
                    value={(daysAgo / 60) * 100}
                    size='xs'
                    colorScheme='purple'
                    backgroundColor='lightgray'
                  />
                  {crucible!.stakes.map((stake, i) => {
                    const daysAgo: number = dayjs().diff(
                      stake.timestamp,
                      'day'
                    );

                    const subscribedAt: string = dayjs(stake.timestamp).format('DD-MMM-YY');

                    return (
                      <Box key={i} width='100%'>
                        <Text fontSize='xs' pt={1} pb={2}>
                          Subscription {i + 1}: {stake.amount} LP ({subscribedAt})
                        </Text>
                        <Progress
                          value={(daysAgo / 60) * 100}
                          size='xs'
                          colorScheme='purple'
                          backgroundColor='lightgray'
                        />
                        <Text fontSize='xs' pt={1} pb={4}>
                          {((daysAgo / 60) * 100).toFixed(0)}% Complete (
                          {daysAgo} of 60 D to max reward multiplier)
                        </Text>
                      </Box>
                    );
                  })}
                </VStack>
                <HStack>
                  <Text fontSize='sm'>
                    Subscribed Crucible LP:{' '}
                    <strong>
                      {Number(crucible.cleanLockedBalance).toFixed(3)}
                    </strong>
                  </Text>
                  <Text fontSize='sm'>
                    Unsubscribed Crucible LP:{' '}
                    <strong>
                      {Number(crucible.cleanUnlockedBalance).toFixed(3)}
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
                  onClick={() => setClaimRewardsModalOpen(true)}
                >
                  <Text fontSize='md'>Claim rewards and unsubscribe</Text>
                </Button>
              </Flex>
            </HStack>

            <VStack justifyContent='center' pt={4}>
              <Button
                width='100%'
                disabled={Number(crucible.cleanUnlockedBalance) <= 0}
                onClick={() => setWithdrawModalOpen(true)}
              >
                <Text fontSize='md'>Withdraw unsubscribed LP</Text>
              </Button>
              {Number(crucible.cleanUnlockedBalance) <= 0 && (
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
