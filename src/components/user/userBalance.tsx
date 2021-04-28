import React, { FC } from 'react';
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/layout';
import { useWeb3 } from '../../context/web3';
import { config } from '../../config/variables';
import { CountUp } from 'use-count-up';

const UserBalance: FC = () => {
  const { tokens, ethBalance } = useWeb3();
  const { mistTokenAddress, lpTokenAddress } = config;

  const balances = [
    {
      label: 'ETH',
      value: ethBalance ? ethBalance?.toFixed(3) : null,
    },
    {
      label: 'MIST',
      value: tokens[mistTokenAddress]
        ? tokens[mistTokenAddress].balance.toFixed(3)
        : null,
    },
    {
      label: 'LP',
      value: tokens[lpTokenAddress]
        ? tokens[lpTokenAddress].balance.toFixed(3)
        : null,
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
              {value ? (
                <CountUp isCounting end={Number(value)} duration={0.4} />
              ) : (
                '0'
              )}
            </Text>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default UserBalance;
