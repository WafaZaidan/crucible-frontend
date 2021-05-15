import React, { FC, useEffect, useMemo, useState } from 'react';
import CrucibleTabs from './crucibleTabs';
import { Button, IconButton } from '@chakra-ui/button';
import { truncate } from '../../../utils/address';
import { useHistory } from 'react-router-dom';
import { Crucible } from '../../../context/crucibles/crucibles';
import { FiArrowLeft, FiCopy, FiSend } from 'react-icons/fi';
import { FaLock } from 'react-icons/fa';
import { Badge, Box, Flex, Heading, HStack, Text } from '@chakra-ui/layout';
import { Tooltip } from '@chakra-ui/tooltip';
import { useClipboard } from '@chakra-ui/hooks';
import { useToast } from '@chakra-ui/toast';
import TransferModal from '../../modals/transferModal';
import formatNumber from '../../../utils/formatNumber';

type Props = {
  crucible: Crucible;
};

const CrucibleDetailCard: FC<Props> = ({ crucible }) => {
  const id = 'copy-toast';

  const toast = useToast();
  const history = useHistory();
  let { hasCopied, onCopy } = useClipboard(crucible.id);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const mintDate = useMemo(() => {
    return formatNumber.date(crucible.mintTimestamp * 1000);
  }, [crucible.mintTimestamp]);

  useEffect(() => {
    if (hasCopied && !toast.isActive(id)) {
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
    <Box position='relative'>
      <Heading top={['-80px', '-120px']} position='absolute' width='100%'>
        Manage Crucible
      </Heading>
      <Flex alignItems='center'>
        <Button
          pl={2}
          pr={3}
          variant='ghost'
          leftIcon={<FiArrowLeft />}
          onClick={() => history.push('/')}
        >
          All Crucibles
        </Button>
      </Flex>
      <Flex
        mt={4}
        p={4}
        bg='gray.700'
        borderRadius='xl'
        flexDir={['column', null, 'row']}
        justifyContent='space-between'
      >
        <HStack spacing={3} flexGrow={1}>
          <Box
            display={['none', 'block']}
            boxSize='48px'
            bgGradient='linear(to-tr, cyan.200, purple.100)'
            borderRadius='md'
          />
          <Box textAlign='left'>
            <Text fontSize='xl'>ID: {truncate(crucible!.id)}</Text>
            <HStack>
              <Text key={0} fontSize='sm' color='gray.300'>
                Minted on {mintDate}
              </Text>
            </HStack>
          </Box>
        </HStack>
        <HStack>
          <Badge py={1} px={2} borderRadius='xl' fontSize='.7em'>
            <HStack>
              <Box>
                <Text color='gray.200' fontSize='lg'>
                  {formatNumber.token(crucible.lockedBalance)} LP
                </Text>
              </Box>
              <Tooltip
                hasArrow
                label='Subscribed amount'
                bg='gray.800'
                color='white'
                placement='bottom-end'
                offset={[0, 16]}
              >
                <div>
                  <FaLock color='cyan.400' />
                </div>
              </Tooltip>
            </HStack>
          </Badge>
          <Tooltip
            hasArrow
            label='Copy Crucible address'
            bg='gray.800'
            color='white'
            placement='top'
          >
            <div>
              <IconButton
                aria-label='copy'
                fontSize='2xl'
                color='cyan.400'
                variant='ghost'
                icon={<FiCopy />}
                onClick={onCopy}
              />
            </div>
          </Tooltip>
          <Tooltip
            hasArrow
            label='Transfer Crucible'
            bg='gray.800'
            color='white'
            placement='top'
          >
            <IconButton
              aria-label='transfer'
              fontSize='2xl'
              color='cyan.400'
              variant='ghost'
              icon={<FiSend />}
              onClick={() => setIsTransferModalOpen(true)}
            />
          </Tooltip>
        </HStack>
      </Flex>
      <Box paddingTop='20px'>
        <CrucibleTabs crucible={crucible} />
      </Box>
      {isTransferModalOpen && (
        <TransferModal
          id={crucible.id}
          onClose={() => setIsTransferModalOpen(false)}
        />
      )}
    </Box>
  );
};

export default CrucibleDetailCard;
