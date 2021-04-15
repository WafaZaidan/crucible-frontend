import dayjs from 'dayjs';
import CrucibleTabs from './crucibleTabs';
import { Button, IconButton } from '@chakra-ui/button';
import { truncate } from '../../../utils/address';
import { useHistory } from 'react-router-dom';
import { Crucible } from '../../../context/crucibles/crucibles';
import { FiArrowLeft, FiArrowUpRight, FiCopy, FiSend } from 'react-icons/fi';
import { Flex, Box, HStack, Text, Heading } from '@chakra-ui/layout';
import { useClipboard } from '@chakra-ui/hooks';
import { useEffect } from 'react';
import { useToast } from '@chakra-ui/toast';

type Props = {
  crucible: Crucible;
};

const CrucibleDetailCard: React.FC<Props> = ({ crucible }) => {
  const id = 'copy-toast';

  const toast = useToast();
  const history = useHistory();
  const { hasCopied, onCopy } = useClipboard(crucible.id);

  useEffect(() => {
    if (hasCopied && !toast.isActive(id)) {
      toast({
        title: 'Copied to clipboard',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCopied]);

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
          All Crucibles
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
      <Flex
        mt={4}
        p={4}
        bg='gray.700'
        borderRadius='xl'
        justifyContent='space-between'
      >
        <HStack spacing={3} flexGrow={1}>
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
        <HStack>
          <IconButton
            aria-label='copy'
            fontSize='2xl'
            color='blue.400'
            variant='ghost'
            icon={<FiCopy />}
            onClick={onCopy}
          />
          <IconButton
            aria-label='transfer'
            fontSize='2xl'
            color='blue.400'
            variant='ghost'
            icon={<FiSend />}
            onClick={undefined}
          />
        </HStack>
      </Flex>
      <Box paddingTop='20px'>
        <CrucibleTabs />
      </Box>
    </Box>
  );
};

export default CrucibleDetailCard;
