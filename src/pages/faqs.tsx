import React, { FC } from 'react';
import {
  Box,
  Center,
  Heading,
  Link,
  Stack,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/layout';

// Todo, use markdown as source
const faqsArray = [
  {
    question: 'What is Alchemist?',
    answer: (
      <Stack>
        <Text>
          Alchemist was started with a{' '}
          <Link
            color='blue.400'
            href='https://twitter.com/thegostep/status/1358159173440184322?s=20'
            isExternal
          >
            tweet
          </Link>{' '}
          by @thegostep.
        </Text>
        <Text>
          There is no “dev team”. There is no company. There is only a community
          of alchemists figuring out what to build in the open.
        </Text>
        <Text>
          There is no roadmap. An alchemist never makes forward looking
          statements, simply because the future is unpredictable.
        </Text>
        <Text>The only plan is there is no plan ⚗️</Text>
      </Stack>
    ),
  },
  {
    question: 'How do I become an Alchemist?',
    answer: (
      <Stack>
        <Text>
          Becoming an alchemist requires learning and practice. Training is a
          way of life for a true alchemist. There is no final destination, only
          continuous change.
        </Text>
        <Text>
          ⚗️ is used to coordinate and reward committed alchemists. Whether you
          are an artist, a developer, a community manager, or a liquidity
          provider, there is a role for you.
        </Text>
        <Text>
          Come meet the other alchemists at{' '}
          <Link
            color='blue.400'
            href='https://discord.com/invite/qWQQMMKjKe'
            isExternal
          >
            discord.alchemist.wtf
          </Link>{' '}
          and offer your skills in the #bounties channel.
        </Text>
      </Stack>
    ),
  },
];

const Faqs: FC = () => {
  return (
    <Box mt={16}>
      <Heading textAlign='center' size='2xl' mb={8}>
        FAQs
      </Heading>
      <Center>
        <Box width='800px' p={8} bg='gray.800' borderRadius='2xl'>
          <VStack
            divider={<StackDivider borderColor='gray.700' />}
            align='stretch'
            spacing={8}
          >
            {faqsArray.map((item) => (
              <VStack spacing={2} alignItems='stretch'>
                <Heading size='lg'>{item.question}</Heading>
                <Text>{item.answer}</Text>
              </VStack>
            ))}
          </VStack>
        </Box>
      </Center>
    </Box>
  );
};

export default Faqs;
