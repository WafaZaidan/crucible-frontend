import { Box, Flex, HStack, Text } from '@chakra-ui/layout';
// import {
//   Stat,
//   StatLabel,
//   StatNumber,
//   StatArrow,
//   StatGroup,
// } from '@chakra-ui/react';

const Rewards = () => {
  return (
    <Box p={4} bg='white' color='gray.800' borderRadius='xl'>
      <Flex justifyContent='space-between' alignItems='start'>
        <HStack width='100%'>
          <Box flexGrow={1} textAlign='left'>
            <Text>Rewards (WIP)</Text>
            <Text fontWeight='bold' fontSize='lg'>
              $257 Earned
            </Text>
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Rewards;
