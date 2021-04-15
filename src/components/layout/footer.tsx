import { IconButton } from '@chakra-ui/button';
import { externalLinks } from '../../config/links';
import { Center, HStack, VStack, Link as ChakraLink } from '@chakra-ui/layout';

const Footer = () => {
  return (
    <Center py={12}>
      <VStack>
        <HStack spacing={4}>
          {externalLinks.map(({ href, label, icon }) => (
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
                size='lg'
                isRound
                fontSize='2xl'
                aria-label={label}
                variant='ghost'
                color='white'
                icon={icon}
                _hover={{
                  background: 'none',
                  boxShadow: '-1px -1px 0px 1px rgb(255, 191, 0)',
                }}
              />
            </ChakraLink>
          ))}
        </HStack>
        {/* <HStack spacing={4}>
          {internalLinks.map((link) => (
            <ChakraLink key={link.label} as={Link} to={link.to}>
              {link.label}
            </ChakraLink>
          ))}
        </HStack> */}
      </VStack>
    </Center>
  );
};

export default Footer;
