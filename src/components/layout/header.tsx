import { SimpleGrid, Box, Flex } from '@chakra-ui/layout';
import UserBalance from '../user/userBalance';
import UserWallet from '../user/userWallet';
import Logo from '../shared/logo';

const Header = () => {
  return (
    <SimpleGrid
      p={4}
      bg='rgba(0,0,0,0.1)'
      columns={[2, null, null, 3]}
      alignItems='center'
    >
      <Box>
        <Logo />
      </Box>
      <Box display={['none', null, null, 'block']}>
        <Flex justifyContent='center'>
          <UserBalance />
        </Flex>
      </Box>
      <Box>
        <Flex justifyContent='flex-end'>
          <UserWallet />
        </Flex>
      </Box>
    </SimpleGrid>
  );
};

export default Header;
