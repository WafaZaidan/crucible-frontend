import { IconButton } from '@chakra-ui/button';
import { externalLinks } from '../../config/links';
import { Flex, HStack, Link as ChakraLink, Box } from '@chakra-ui/layout';

const Footer = () => {
  return (
    <Flex p={4} alignItems='flex-end' flexDirection='column'>
      <Box>
        <HStack spacing={4}>
          {externalLinks.map(({ href, label, icon: Icon }) => (
            <ChakraLink
              key={label}
              href={href}
              fontSize='sm'
              isExternal
              rel='noopener noreferrer'
              _hover={{
                color: 'white',
              }}
            >
              <IconButton
                isRound
                aria-label={label}
                variant='ghost'
                color='white'
                icon={<Icon width='40px' height='40px' />}
                _hover={{
                  background: 'none',
                  boxShadow: '-1px -1px 0px 1px #2EDCFF',
                }}
              />
            </ChakraLink>
          ))}
        </HStack>
      </Box>
      <Box py={2}>
        <HStack spacing={4}>
          <ChakraLink
            href='https://hackmd.io/@alchemistcoin/HyJXT7tL_/%2FrJSJU5PIu#AludelCrucible-FAQ'
            target='_blank'
          >
            FAQs
          </ChakraLink>
        </HStack>
      </Box>
    </Flex>
  );
};

export default Footer;
