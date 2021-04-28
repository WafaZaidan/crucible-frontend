import React, { FC } from 'react';
import { Image } from '@chakra-ui/image';
import { Box, Heading, Text } from '@chakra-ui/layout';
import pot from '../../img/pot.png';

const MissingCrucibles: FC = () => {
  return (
    <Box textAlign='center'>
      <Image src={pot} height='220px' htmlHeight='220px' mx='auto' my={8} />
      <Heading size='lg'>You have no Crucibles</Heading>
      <Text color='gray.200' my={3}>
        It looks like you have no Crucibles. If you have just minted one, it may
        take a few minutes for it to show up. Otherwise, click on the mint tab
        to get your first one.
      </Text>
    </Box>
  );
};

export default MissingCrucibles;
