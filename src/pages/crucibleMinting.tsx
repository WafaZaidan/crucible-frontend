import { Center, Flex } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { useWeb3 } from '../context/web3';
import MintingTabs from '../components/minting/mintingTabs';
import MintingGuide from '../components/minting/mintingGuide';

const CrucibleMinting = () => {
  const { address, isLoading } = useWeb3();

  return (
    <Center>
      <Flex
        p={8}
        bg='gray.800'
        flexDir='column'
        mt={[32, 32, 40]}
        textAlign='center'
        width={['100%', '100%', 480]}
        borderRadius='3xl'
        boxShadow='xl'
        minH='400px'
      >
        {isLoading ? (
          <Flex justifyContent='center' alignItems='center' flexGrow={1}>
            <Spinner />
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
