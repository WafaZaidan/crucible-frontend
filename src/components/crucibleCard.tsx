import React, { useState } from 'react';
import { truncate } from '../utils/address';
import { useHistory } from 'react-router-dom';
import { Button, IconButton } from '@chakra-ui/button';
import { Collapse } from '@chakra-ui/transition';
import { Crucible } from '../context/crucibles/crucibles';
import { Box, Flex, HStack, Stack, Text } from '@chakra-ui/layout';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/tooltip';
import { IoChevronDownCircle, IoArrowRedoCircleSharp } from 'react-icons/io5';
import { Skeleton } from '@chakra-ui/skeleton';
import dayjs from 'dayjs';

type Props = {
  crucible: Crucible;
  isExpanded?: boolean;
  isRewardsLoading: boolean;
};

const CrucibleCard: React.FC<Props> = ({
  crucible,
  isExpanded,
  isRewardsLoading,
}) => {
  const [showDetails, setShowDetails] = useState(isExpanded);
  const history = useHistory();

  return (
    <Box p={4} bg='white' color='gray.800' borderRadius='xl'>
      <Flex justifyContent='space-between' alignItems='center'>
        <Box flexGrow={1}>
          <HStack>
            <Box
              boxSize='38px'
              bgGradient='linear(to-tr, cyan.200, yellow.500)'
              borderRadius='md'
            />
            <Box textAlign='left'>
              <Text>ID: {truncate(crucible.id)}</Text>
              {/* TODO, make sure all the data is in context */}
              <Text fontSize='sm' color='gray.400'>
                Minted{' '}
                {dayjs(crucible.mintTimestamp * 1000).format('MMM-DD YYYY')}
              </Text>
            </Box>
          </HStack>
        </Box>
        <Box>
          <IconButton
            aria-label='Manage crucible'
            size='sm'
            bg='none'
            fontSize='2xl'
            color='gray.300'
            icon={<IoArrowRedoCircleSharp />}
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
        {/* TODO */}
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
                  {!isNaN(crucible.tokenRewards)
                    ? Number(crucible.tokenRewards).toFixed(4)
                    : '0'}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type='increase' />$
                  {!isNaN(crucible.tokenRewards) && crucible.mistPrice
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
                  {!isNaN(crucible.etherRewards)
                    ? Number(crucible.etherRewards).toFixed(4)
                    : '0'}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type='increase' />$
                  {!isNaN(crucible.etherRewards) && crucible.wethPrice
                    ? (crucible.etherRewards * crucible.wethPrice).toFixed(0)
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
