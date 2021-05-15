import React, { FC, useEffect, useState } from 'react';
import { truncate } from '../../utils/address';
import { useHistory } from 'react-router-dom';
import { Button, IconButton } from '@chakra-ui/button';
import { Collapse } from '@chakra-ui/transition';
import { Crucible } from '../../context/crucibles/crucibles';
import { Badge, Box, Flex, HStack, Stack, Text } from '@chakra-ui/layout';
import { FaLock } from 'react-icons/fa';
import { useClipboard } from '@chakra-ui/hooks';
import {
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  useToast,
} from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/tooltip';
import { IoChevronDownCircle } from 'react-icons/io5';
import { IoMdSettings } from 'react-icons/io';
import { Skeleton } from '@chakra-ui/skeleton';
import { FiCopy } from 'react-icons/fi';
import formatNumber from '../../utils/formatNumber';
import getMultiplier from '../../utils/getMultiplier';

type Props = {
  crucible: Crucible;
  isExpanded?: boolean;
  isRewardsLoading: boolean;
};

const CrucibleCard: FC<Props> = ({
  crucible,
  isExpanded,
  isRewardsLoading,
}) => {
  const [showDetails, setShowDetails] = useState(isExpanded);
  const history = useHistory();
  const toast = useToast();

  let { hasCopied, onCopy } = useClipboard(crucible.id);

  const routeToCrucibleDetails = () => {
    history.push(`/crucible/${crucible.id}`);
  };

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: 'Copied crucible address',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCopied]);

  let mistRewardsUSD;
  if (crucible.mistRewards && crucible.mistPrice) {
    mistRewardsUSD = crucible.mistRewards
      .mul(crucible.mistPrice)
      .div(getMultiplier());
  }

  let wethRewardsUSD;
  if (crucible.wethRewards && crucible.wethPrice) {
    wethRewardsUSD = crucible.wethRewards
      .mul(crucible.wethPrice)
      .div(getMultiplier());
  }

  const subscriptionText =
    crucible.stakes?.length === 0
      ? 'No subscriptions'
      : crucible.stakes?.length === 1
      ? '1 subscription'
      : `${crucible.stakes?.length} subscriptions`;

  return (
    <Box p={4} bg='white' color='gray.800' borderRadius='xl'>
      <Flex justifyContent='space-between' alignItems='center' flexDir='row'>
        <Box flexGrow={1}>
          <Stack direction={['column', 'row']}>
            <Box
              display={['none', 'block']}
              boxSize='48px'
              bgGradient='linear(to-tr, cyan.200, purple.100)'
              borderRadius='md'
            />
            <Box textAlign='left'>
              <Stack direction='row' cursor='pointer' onClick={onCopy}>
                <Text onClick={onCopy}>ID: {truncate(crucible.id)}</Text>
                <FiCopy />
              </Stack>
              <Text fontSize='xs' color='gray.400' width='100%'>
                {`Minted on ${formatNumber.date(
                  crucible.mintTimestamp * 1000
                )}`}
                <br />
                <Text color='gray.400' display={['block', 'none']}>
                  {formatNumber.token(crucible.lockedBalance)} LP subscribed
                </Text>
                {subscriptionText}
              </Text>
            </Box>
          </Stack>
        </Box>
        <Badge
          py={1}
          px={2}
          borderRadius='xl'
          fontSize='.7em'
          display={['none', 'block']}
        >
          <Stack direction={['row', 'row']}>
            <Box>
              <Text color='gray.400'>
                {formatNumber.token(crucible.lockedBalance)} LP
              </Text>
            </Box>
            <Tooltip
              hasArrow
              label='Subscribed amount'
              bg='gray.800'
              color='white'
              placement='bottom-end'
              offset={[0, 16]}
            >
              <div>
                <FaLock />
              </div>
            </Tooltip>
          </Stack>
        </Badge>
        <Box>
          <IconButton
            aria-label='Manage crucible'
            size='sm'
            bg='none'
            fontSize='2xl'
            color='gray.300'
            icon={<IoMdSettings />}
            onClick={routeToCrucibleDetails}
            _hover={{ bg: 'none', color: 'gray.800' }}
            _active={{ bg: 'none' }}
          />
          <IconButton
            aria-label='Quick view'
            size='sm'
            bg='none'
            fontSize='2xl'
            color='gray.300'
            icon={<IoChevronDownCircle />}
            onClick={() => setShowDetails(!showDetails)}
            _hover={{ bg: 'none', color: 'gray.800' }}
            _active={{ bg: 'none' }}
          />
        </Box>
      </Flex>

      <Collapse in={showDetails}>
        {isRewardsLoading ? (
          <Stack direction={['column', 'row']} my={4}>
            <Skeleton startColor='gray.50' endColor='gray.100' height='20px' />
            <Skeleton startColor='gray.50' endColor='gray.100' height='20px' />
            <Skeleton startColor='gray.50' endColor='gray.100' height='20px' />
          </Stack>
        ) : (
          <StatGroup mt={4} alignItems='baseline'>
            <Tooltip
              label='Total protocol rewards from MIST inflation'
              placement='top'
              hasArrow={true}
            >
              <Stat>
                <StatLabel>MIST Rewards</StatLabel>
                <StatNumber>
                  {formatNumber.token(crucible.mistRewards || 0)}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type='increase' />
                  {mistRewardsUSD ? formatNumber.currency(mistRewardsUSD) : '-'}
                </StatHelpText>
              </Stat>
            </Tooltip>

            <Tooltip
              label='Total protocol rewards from the ETH rewards pool'
              placement='top'
              hasArrow={true}
            >
              <Stat>
                <StatLabel>ETH Rewards</StatLabel>
                <StatNumber>
                  {formatNumber.token(crucible.wethRewards || 0)}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type='increase' />
                  {wethRewardsUSD ? formatNumber.currency(wethRewardsUSD) : '-'}
                </StatHelpText>
              </Stat>
            </Tooltip>
          </StatGroup>
        )}
        <Button
          isFullWidth
          disabled={isRewardsLoading}
          onClick={routeToCrucibleDetails}
        >
          Manage crucible
        </Button>
      </Collapse>
    </Box>
  );
};

export default CrucibleCard;
