import { useEffect } from 'react';
import { useToast } from '@chakra-ui/toast';
import { Box, Link, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import { IconButton } from '@chakra-ui/button';
import { IoCloseCircle } from 'react-icons/io5';
import pot3d from '../../img/pot-3d.png';

const WelcomeToast = () => {
  const toast = useToast();
  const toastId = 'faqs-toast';
  const faqsToastClosed = localStorage.getItem('faqs-toast-closed');

  const handleClose = () => {
    localStorage.setItem('faqs-toast-closed', 'true');
    toast.closeAll({ positions: ['bottom-left'] });
  };

  useEffect(() => {
    if (!toast.isActive(toastId) && !faqsToastClosed) {
      toast({
        id: toastId,
        duration: null,
        isClosable: true,
        position: 'bottom-left',
        render: () => (
          <Box
            m={4}
            p={8}
            bg='gray.700'
            position='relative'
            borderRadius='3xl'
            width={['320px', '320px', '340px']}
          >
            <Box ml={20}>
              <Text fontWeight='bold'>
                First time minting a crucible? Read our{' '}
                <Link
                  isExternal
                  href='https://hackmd.io/@alchemistcoin/HyJXT7tL_/%2FrJSJU5PIu#AludelCrucible-FAQ'
                  color='blue.500'
                  fontWeight='bold'
                >
                  FAQs.
                </Link>
              </Text>
            </Box>
            <IconButton
              bg='none'
              top={1}
              right={1}
              position='absolute'
              fontSize='xl'
              color='gray.200'
              icon={<IoCloseCircle />}
              onClick={handleClose}
              aria-label='close toast'
              _hover={{ bg: 'none' }}
              _active={{ bg: 'none' }}
            />
            <Image
              src={pot3d}
              top={-10}
              left={0}
              height='160px'
              htmlHeight='160px'
              position='absolute'
            />
          </Box>
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default WelcomeToast;
