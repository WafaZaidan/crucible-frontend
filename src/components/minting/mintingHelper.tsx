import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/accordion';
import { Alert } from '@chakra-ui/alert';
import { Box } from '@chakra-ui/layout';

const MintingHelper = () => {
  return (
    <Accordion allowMultiple mb={4}>
      <AccordionItem border='none'>
        <h2>
          <AccordionButton px={0} fontWeight='semibold' fontSize='xl'>
            <Box flex='1' textAlign='left'>
              How does it work?
            </Box>
            <AccordionIcon bg='gray.700' borderRadius='100%' />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} textAlign='left' px={0}>
          <Alert borderRadius='xl' fontSize='sm'>
            Mint a Crucible with your LP tokens to enroll in the MIST rewards
            program. A Crucible is an NFT representation of your LP token
            deposit. Your rewards rate increases with duration of your stake and
            you can increase your stake at any time.
          </Alert>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default MintingHelper;
