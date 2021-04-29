import React, { FC } from 'react';
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/layout';
import { CountUp } from 'use-count-up';
import useTokenBalances from '../../hooks/useTokenBalances';

const UserBalance: FC = () => {
  const {
    ethBalanceDisplay,
    mistBalanceDisplay,
    lpBalanceDisplay,
  } = useTokenBalances();

  const balances = [
    {
      label: 'ETH',
      value: ethBalanceDisplay,
    },
    {
      label: 'MIST',
      value: mistBalanceDisplay,
    },
    {
      label: 'LP',
      value: lpBalanceDisplay,
    },
  ];

  return (
    <Box
      p={2}
      width={497}
      height={12}
      bg='gray.900'
      borderRadius='xl'
      boxShadow='xl'
    >
      <SimpleGrid columns={3} spacing={2} fontSize='sm' height='100%'>
        {balances.map(({ label, value }) => (
          <Flex
            key={label}
            alignItems='center'
            borderRadius='md'
            bg='gray.800'
            px={2}
          >
            <Text color='gray.300' mr={2}>
              {label}:
            </Text>{' '}
            <Text fontWeight='bold'>
              <CountUp isCounting end={Number(value)} duration={0.4} />
            </Text>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default UserBalance;
