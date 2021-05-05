import React, { FC, useMemo } from 'react';
import { Center, Flex, Text, VStack } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { networkName } from '../utils/network';
import MintingTabs from '../components/minting/mintingTabs';
import MintingGuide from '../components/minting/mintingGuide';
import { useWeb3React } from '@web3-react/core';

const CrucibleMinting: FC = () => {
  const { account, chainId } = useWeb3React();

  const supportedNetwork = Number(process.env.REACT_APP_NETWORK_ID);
  const networkUnsupported = chainId !== supportedNetwork;

  const renderContent = useMemo(() => {
    if (!account) {
      return <MintingGuide />;
    }
    if (networkUnsupported) {
      return (
        <Flex justifyContent='center' alignItems='center' flexGrow={1}>
          <VStack>
            <Spinner />
            <Text pt={4}>
              Unsupported network. Please switch to{' '}
              <strong>{networkName(supportedNetwork)}</strong>. If you are on
              the <strong>Taichi</strong> network you need to switch back to{' '}
              <strong>{networkName(supportedNetwork)}</strong> to view your
              Crucibles.
            </Text>
          </VStack>
        </Flex>
      );
    }
    return <MintingTabs />;
  }, [account, networkUnsupported]);

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
        {renderContent}
      </Flex>
    </Center>
  );
};

export default CrucibleMinting;
