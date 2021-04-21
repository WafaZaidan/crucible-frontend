import { useEffect } from 'react';
import { useToast } from '@chakra-ui/toast';
import { Box, Link, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import { IconButton } from '@chakra-ui/button';
import { IoCloseCircle } from 'react-icons/io5';
import pot from '../../img/pot.png';

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
        duration: 9000,
        isClosable: true,
        position: 'bottom-left',
        render: () => (
          <Box
            m={4}
            p={8}
            bg='white'
            color='gray.800'
            position='relative'
            borderTopLeftRadius='3xl'
            borderBottomRightRadius='3xl'
            width={['300px', '300px', '368px']}
          >
            <Box ml={24}>
              <Text>
                First time minting a crucible? Read our{' '}
                <Link
                  isExternal
                  href='https://hackmd.io/@alchemistcoin/HyJXT7tL_/%2FrJSJU5PIu'
                  color='blue.500'
                  fontWeight='bold'
                >
                  FAQs.
                </Link>
              </Text>
            </Box>
            <IconButton
              bg='none'
              top={-3}
              right={-3}
              position='absolute'
              fontSize='4xl'
              color='red.400'
              icon={<IoCloseCircle />}
              onClick={handleClose}
              aria-label='close toast'
              _hover={{ bg: 'none' }}
              _active={{ bg: 'none' }}
            />
            <Image
              src={pot}
              top={-8}
              left={-6}
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
