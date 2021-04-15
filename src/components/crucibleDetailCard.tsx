import dayjs from 'dayjs';
import { Button } from '@chakra-ui/button';
import { truncate } from '../utils/address';
import { useHistory } from 'react-router-dom';
import { Crucible } from '../context/crucibles/crucibles';
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import { Flex, Box, HStack, Text, Heading } from '@chakra-ui/layout';
import CrucibleTabs from '../components/crucibleTabs';

type Props = {
  crucible: Crucible;
};

const CrucibleDetailCard: React.FC<Props> = ({ crucible }) => {
  const history = useHistory();
  return (
    <Box position='relative'>
      <Heading top='-100px' position='absolute' width='100%'>
        Manage Crucible
      </Heading>
      <Flex justifyContent='space-between' alignItems='center'>
        <Button
          pl={2}
          pr={3}
          variant='ghost'
          leftIcon={<FiArrowLeft />}
          onClick={() => history.push('/')}
        >
          All Crucilbes
        </Button>
        <Button
          pl={3}
          pr={3}
          variant='ghost'
          rightIcon={<FiArrowUpRight />}
          onClick={() => undefined}
        >
          Transfer Crucible
        </Button>
      </Flex>
      <Flex>
        <Box flexGrow={1} mt={4} p={4} bg='gray.700' borderRadius='xl'>
          <HStack spacing={3}>
            <Box
              boxSize='48px'
              bgGradient='linear(to-tr, cyan.200, yellow.500)'
              borderRadius='md'
            />
            <Box textAlign='left'>
              <Text fontSize='xl'>ID: {truncate(crucible.id)}</Text>
              <Text fontSize='lg' color='gray.300'>
                {dayjs(crucible.mintTimestamp * 1000).format('MMM-DD YYYY')}
              </Text>
            </Box>
          </HStack>
        </Box>
      </Flex>
      <Box paddingTop='20px'>
        <CrucibleTabs />
      </Box>
    </Box>
  );
};

export default CrucibleDetailCard;
