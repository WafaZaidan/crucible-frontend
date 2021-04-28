import React, { FC } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/accordion';
import { Alert } from '@chakra-ui/alert';
import { Box } from '@chakra-ui/layout';

const MintingHelper: FC = () => {
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
            Mint a Crucible with your LP tokens to subscribe to the Aludel
            Rewards program and earn MIST. A Crucible is an NFT that acts like a
            universal vault, capable of storing your LP tokens and subscribing
            them to participating rewards programs. Your rewards rate increases
            with the duration of your subscription and you can increase the
            quantity of subscribed LP at any time.
          </Alert>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default MintingHelper;
