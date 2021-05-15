import React, { FC } from 'react';
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/layout';
import { CountUp } from 'use-count-up';
import useTokenBalances from '../../hooks/useTokenBalances';
import formatNumber from '../../utils/formatNumber';
import bigNumberishToNumber from '../../utils/bigNumberishToNumber';

const UserBalance: FC = () => {
  const { ethBalance, mistBalance, lpBalance } = useTokenBalances();

  const balances = [
    {
      label: 'ETH',
      // Ain't pretty but CountUp doesn't have ability to display "-" for a not yet loaded ethBalance
      // Instead if ethBalance is undefined set value to -1, and have the CountUp formatter display negatives as "-"
      value: ethBalance ? bigNumberishToNumber(ethBalance) : -1,
    },
    {
      label: 'MIST',
      value: mistBalance ? bigNumberishToNumber(mistBalance) : -1,
    },
    {
      label: 'LP',
      value: lpBalance ? bigNumberishToNumber(lpBalance) : -1,
    },
  ];

  return (
    <Box
      p={2}
      width={497}
      height={12}
      bg='gray.900'
      borderRadius={[0, 'xl']}
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
              <CountUp
                isCounting={true}
                end={value}
                autoResetKey={value}
                duration={0.4}
                formatter={(value) => {
                  return value >= 0 ? formatNumber.token(value) : '-';
                }}
              />
            </Text>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default UserBalance;
