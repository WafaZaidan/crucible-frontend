import React, { FC } from 'react';
import { Center, Flex, Text, VStack } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { useWeb3 } from '../context/web3';
import { networkName } from '../utils/network';
import MintingTabs from '../components/minting/mintingTabs';
import MintingGuide from '../components/minting/mintingGuide';

const CrucibleMinting: FC = () => {
  const { address, isLoading, network } = useWeb3();

  const supportedNetwork = Number(process.env.REACT_APP_NETWORK_ID);
  const networkUnsupported = network !== supportedNetwork;

  return (
    <Center>
      <Flex
        p={10}
        bg='purple.800'
        flexDir='column'
        mt={[32, 32, 40]}
        textAlign='center'
        width={['100%', '100%', 497]}
        borderRadius='3xl'
        boxShadow='xl'
        minH='400px'
      >
        {isLoading ? (
          <Flex justifyContent='center' alignItems='center' flexGrow={1}>
            <Spinner />
          </Flex>
        ) : address && networkUnsupported ? (
          <Flex justifyContent='center' alignItems='center' flexGrow={1}>
            <VStack>
              <Spinner />
              <Text pt={4}>
                Unsupported network. Please switch to{' '}
                {networkName(supportedNetwork)}
              </Text>
            </VStack>
          </Flex>
        ) : !address ? (
          <MintingGuide />
        ) : (
          <MintingTabs />
        )}
      </Flex>
    </Center>
  );
};

export default CrucibleMinting;
