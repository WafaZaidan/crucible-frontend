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
  return (
    <Box>
      <Image src={pot} height='220px' htmlHeight='220px' mx='auto' mt={-32} />
      <Heading size='xl' py={4}>
        Aludel rewards
      </Heading>

      <Accordion allowMultiple mb={4}>
        <AccordionItem border='none'>
          <h2>
            <AccordionButton px={0} fontWeight='semibold' fontSize='xl'>
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
              <AccordionIcon bg='gray.700' borderRadius='100%' />
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
                <Link color='blue.400' href={getMistUrl}>
                  here
                </Link>
                .
              </Text>
            </Alert>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border='none'>
          <h2>
            <AccordionButton px={0} fontWeight='semibold' fontSize='xl'>
              <Box flex='1' textAlign='left'>
                <HStack alignItems='top'>
                  <Text>2.</Text>
                  <Text>Mint a Crucible using LP tokens</Text>
                </HStack>
              </Box>
              <AccordionIcon bg='gray.700' borderRadius='100%' />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} textAlign='left' px={0}>
            <Alert borderRadius='xl' fontSize='sm'>
              Mint a Crucible NFT using your MIST-ETH LP to enroll in the Aludel
              Rewards program. Your Crucible will accrue MIST token rewards
              proportional to your staked LP and the duration of the stake.
            </Alert>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border='none'>
          <h2>
            <AccordionButton px={0} fontWeight='semibold' fontSize='xl'>
              <Box flex='1' textAlign='left'>
                <HStack alignItems='top'>
                  <Text>3.</Text>
                  <Text>Earn rewards with Crucible</Text>
                </HStack>
              </Box>
              <AccordionIcon bg='gray.700' borderRadius='100%' />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} textAlign='left' px={0}>
            <Alert borderRadius='xl' fontSize='sm'>
              View how much rewards you have earned, increase your LP stake to
              earn more rewards, withdraw your earned rewards and your LP
              tokens, or transfer your crucible to another wallet.
            </Alert>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Button size='lg' isFullWidth onClick={() => onboard?.walletSelect()}>
        Connect wallet
      </Button>
      <WelcomeToast />
    </Box>
  );
};

export default MintingGuide;
