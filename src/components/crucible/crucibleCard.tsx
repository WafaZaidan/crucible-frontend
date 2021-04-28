import React, { FC, useEffect, useState } from 'react';
import { truncate } from '../../utils/address';
import { useHistory } from 'react-router-dom';
import { Button, IconButton } from '@chakra-ui/button';
import { Collapse } from '@chakra-ui/transition';
import { Crucible } from '../../context/crucibles/crucibles';
import { Box, Flex, HStack, Stack, Text, Badge } from '@chakra-ui/layout';
import { FaLock } from 'react-icons/fa';
import { useClipboard } from '@chakra-ui/hooks';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  useToast,
} from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/tooltip';
import { IoChevronDownCircle } from 'react-icons/io5';
import { IoMdSettings } from 'react-icons/io';
import { Skeleton } from '@chakra-ui/skeleton';
import { FiCopy } from 'react-icons/fi';
import dayjs from 'dayjs';

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

  return (
    <Box p={4} bg='white' color='gray.800' borderRadius='xl'>
      <Flex justifyContent='space-between' alignItems='center'>
        <Box flexGrow={1}>
          <HStack>
            <Box
              boxSize='38px'
              bgGradient='linear(to-tr, cyan.200, purple.100)'
              borderRadius='md'
            />
            <Box textAlign='left'>
              <HStack cursor='pointer' onClick={onCopy}>
                <Text onClick={onCopy}>ID: {truncate(crucible.id)}</Text>
                <FiCopy />
              </HStack>
              <Text fontSize='sm' color='gray.400'>
                Minted{' '}
                {dayjs(
                  crucible.stakes[0]?.timestamp
                    ? crucible.stakes[0]?.timestamp
                    : crucible.mintTimestamp
                ).format('MMM-DD YYYY')}
              </Text>
            </Box>
          </HStack>
        </Box>
        <Badge py={1} px={2} borderRadius='xl' fontSize='.7em'>
          <HStack>
            <Box>
              <Text color='gray.400'>
                {Number(crucible?.cleanLockedBalance).toFixed(3)} LP
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
          </HStack>
        </Badge>
        <Box>
          <IconButton
            aria-label='Manage crucible'
            size='sm'
            bg='none'
            fontSize='2xl'
            color='gray.300'
            icon={<IoMdSettings />}
            onClick={() => history.push('/crucible', { crucible })}
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
          <Stack my={4}>
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
                <StatLabel>Earned MIST Rewards</StatLabel>
                <StatNumber>
                  {crucible.tokenRewards
                    ? crucible.tokenRewards.toFixed(3)
                    : '0.000'}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type='increase' />$
                  {crucible.tokenRewards && crucible.mistPrice
                    ? (crucible.tokenRewards * crucible.mistPrice).toFixed(0)
                    : '0'}
                </StatHelpText>
              </Stat>
            </Tooltip>

            <Tooltip
              label='Total protocol rewards from the ETH rewards pool'
              placement='top'
              hasArrow={true}
            >
              <Stat>
                <StatLabel>Earned ETH Rewards</StatLabel>
                <StatNumber>
                  {crucible.ethRewards?.toFixed(3) || '0.000'}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type='increase' />$
                  {crucible.ethRewards && crucible.wethPrice
                    ? (crucible.ethRewards * crucible.wethPrice).toFixed(0)
                    : '0'}
                </StatHelpText>
              </Stat>
            </Tooltip>
          </StatGroup>
        )}
        <Button
          isFullWidth
          disabled={isRewardsLoading}
          onClick={() => history.push('/crucible', { crucible })}
        >
          Manage crucible
        </Button>
      </Collapse>
    </Box>
  );
};

export default CrucibleCard;
