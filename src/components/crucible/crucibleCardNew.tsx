import React, { FC, useEffect } from 'react';
import { truncate } from '../../utils/address';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@chakra-ui/button';
import { Crucible } from '../../store/crucibles';
import { Box, Flex, Stack, Text } from '@chakra-ui/layout';
import { useClipboard } from '@chakra-ui/hooks';
import { useToast } from '@chakra-ui/toast';
import { IoMdSettings } from 'react-icons/io';
import { FiCopy } from 'react-icons/fi';
import formatNumber from '../../utils/formatNumber';

type Props = {
  crucible: Crucible;
};

const CrucibleCard: FC<Props> = ({ crucible }) => {
  const history = useHistory();
  const toast = useToast();
  let { hasCopied, onCopy } = useClipboard(crucible.id);

  const routeToCrucibleDetails = () => {
    history.push(`/crucible/${crucible.id}`);
  };

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: 'Copied crucible address',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCopied]);

  return (
    <Box p={4} bg='white' color='gray.800' borderRadius='xl'>
      <Flex justifyContent='space-between' alignItems='center' w='100%'>
        <Box flexGrow={1}>
          <Stack direction={['column', 'row']}>
            <Box
              display={['none', 'block']}
              boxSize='42px'
              bgGradient='linear(to-tr, cyan.200, purple.100)'
              borderRadius='md'
              mr={1}
            />
            <Box textAlign='left'>
              <Stack direction='row' cursor='pointer' onClick={onCopy}>
                <Text onClick={onCopy}>ID: {truncate(crucible.id)}</Text>
                <FiCopy />
              </Stack>
              <Text fontSize='xs' color='gray.400' width='100%'>
                {`Minted on ${formatNumber.date(
                  crucible.mintTimestamp * 1000
                )}`}
              </Text>
            </Box>
          </Stack>
        </Box>

        <IconButton
          aria-label='Manage crucible'
          size='sm'
          bg='none'
          fontSize='2xl'
          color='gray.300'
          icon={<IoMdSettings />}
          onClick={routeToCrucibleDetails}
          _hover={{ bg: 'none', color: 'gray.800' }}
          _active={{ bg: 'none' }}
        />
      </Flex>
    </Box>
  );
};

export default CrucibleCard;
