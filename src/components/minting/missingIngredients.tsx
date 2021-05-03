import React, { FC } from 'react';
import { Image } from '@chakra-ui/image';
import { Box, Heading, Link, Text } from '@chakra-ui/layout';
import { config } from '../../config/variables';
import pot from '../../img/pot.png';

const MissingIngredients: FC = () => {
  const { uniswapPoolUrl, getMistUrl } = config;
  return (
    <Box textAlign='center'>
      <Image src={pot} height='220px' htmlHeight='220px' mx='auto' my={8} />
      <Heading size='lg'>Missing ingredients</Heading>
      <Text color='gray.200' my={3}>
        You need MIST-ETH LP tokens to mint a Crucible. Get them by adding MIST
        and ETH to the{' '}
        <Link color='blue.400' href={uniswapPoolUrl} isExternal>
          Uniswap pool.
        </Link>{' '}
        If you don't have any MIST tokens, you can purchase them{' '}
        <Link color='blue.400' href={getMistUrl} isExternal>
          here
        </Link>
        .
      </Text>
    </Box>
  );
};

export default MissingIngredients;
