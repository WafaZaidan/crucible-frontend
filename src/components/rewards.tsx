import { Box, Flex, HStack, Text } from '@chakra-ui/layout';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react';

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
            <HStack paddingTop='1rem'>
              <StatGroup mt={4} alignItems='baseline' width='100%'>
                <Stat>
                  <StatLabel paddingBottom='.5rem'>
                    Earned ETH Rewards
                  </StatLabel>
                  <StatNumber fontSize='md'>0.42(-0.506)</StatNumber>
                  <StatArrow type='increase' />
                  $536
                </Stat>
                <Stat>
                  <StatLabel paddingBottom='.5rem'>
                    Earned Mist Rewards
                  </StatLabel>
                  <StatNumber fontSize='md'>0.42(-0.506)</StatNumber>
                  <StatArrow type='increase' />
                  $536
                </Stat>
              </StatGroup>
            </HStack>
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Rewards;
