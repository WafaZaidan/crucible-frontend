import { Image } from '@chakra-ui/image';
import { Box, Heading, Text } from '@chakra-ui/layout';
import pot from '../../img/pot.png';

const MissingCrucibles = () => {
  return (
    <Box textAlign='center'>
      <Image src={pot} height='220px' htmlHeight='220px' mx='auto' my={8} />
      <Heading size='lg'>You have no crucibles</Heading>
      <Text color='gray.200' my={3}>
        It looks like you have no Crucibles. If you have just minted a crucible
        it may take a while for it to show up. Otherwise, click on the mint tab
        to mint your first crucible. Refresh now.
      </Text>
    </Box>
  );
};

export default MissingCrucibles;
