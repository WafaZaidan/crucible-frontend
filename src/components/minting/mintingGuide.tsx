import { Box, Heading, HStack, Link, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import pot from '../../img/pot.png';
import { Button } from '@chakra-ui/button';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/accordion';
import { Alert } from '@chakra-ui/alert';
import { useWeb3 } from '../../context/web3';
import { config } from '../../config/variables';
import WelcomeToast from '../shared/welcomeToast';

const MintingGuide = () => {
  const { onboard } = useWeb3();
  const { uniswapPoolUrl, getMistUrl } = config;

  const handleConnect = async () => {
    await onboard?.walletSelect();
    await onboard?.walletCheck();
  };

  return (
    <Box position='relative'>
      <Image
        src={pot}
        height='240px'
        htmlHeight='240px'
        position='absolute'
        right='0px'
        top='-124px'
      />
      <Heading textAlign='left' fontSize='2.5rem' py={4} maxW='240px'>
        Aludel Rewards
      </Heading>

      <Accordion allowMultiple mt={2} mb={8}>
        <AccordionItem border='none'>
          <h2>
            <AccordionButton px={0} fontSize='lg'>
              <Box flex='1' textAlign='left'>
                <HStack alignItems='top'>
                  <Text>1.</Text>
                  <Text>
                    <Link color='blue.400' href={uniswapPoolUrl} isExternal>
                      Provide liquidity
                    </Link>{' '}
                    to get LP tokens
                  </Text>
                </HStack>
              </Box>
              <AccordionIcon
                bg='blue.600'
                fontSize='18px'
                color='purple.800'
                borderRadius='100%'
              />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} textAlign='left' px={0}>
            <Alert borderRadius='xl' fontSize='sm'>
              <Text>
                Get MIST-ETH liquidity pool (LP) tokens by adding MIST and ETH
                to the{' '}
                <Link
                  display='contents'
                  color='blue.400'
                  href={uniswapPoolUrl}
                  isExternal
                >
                  Uniswap pool
                </Link>
                . If you don't have any MIST tokens, you can purchase them{' '}
                <Link color='blue.400' href={getMistUrl} isExternal>
                  here
                </Link>
                .
              </Text>
            </Alert>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border='none'>
          <h2>
            <AccordionButton px={0} fontSize='lg'>
              <Box flex='1' textAlign='left'>
                <HStack alignItems='top'>
                  <Text>2.</Text>
                  <Text>Mint a Crucible using LP tokens</Text>
                </HStack>
              </Box>
              <AccordionIcon
                bg='blue.600'
                fontSize='18px'
                color='purple.800'
                borderRadius='100%'
              />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} textAlign='left' px={0}>
            <Alert borderRadius='xl' fontSize='sm'>
              Mint a Crucible NFT using your MIST-ETH LP to subscribe to the
              Aludel rewards program. Your Crucible will accrue MIST token
              rewards proportional to your subscribed LP and the duration of the
              stake.
            </Alert>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border='none'>
          <h2>
            <AccordionButton px={0} fontSize='lg'>
              <Box flex='1' textAlign='left'>
                <HStack alignItems='top'>
                  <Text>3.</Text>
                  <Text>Earn rewards with Crucible</Text>
                </HStack>
              </Box>
              <AccordionIcon
                bg='blue.600'
                fontSize='18px'
                color='purple.800'
                borderRadius='100%'
              />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} textAlign='left' px={0}>
            <Alert borderRadius='xl' fontSize='sm'>
              View the rewards you have earned, increase your LP subscription to
              earn more rewards, withdraw your earned rewards and unsubscribe
              your LP tokens, withdraw LP from Crucible, or transfer your
              crucible to another wallet.
            </Alert>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Button size='lg' isFullWidth onClick={handleConnect}>
        Connect Wallet
      </Button>
      <WelcomeToast />
    </Box>
  );
};

export default MintingGuide;
