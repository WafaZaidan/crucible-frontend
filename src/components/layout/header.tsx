import React, { FC } from 'react';
import { Flex, GridItem, Grid } from '@chakra-ui/layout';
import UserBalance from '../user/userBalance';
import UserWallet from '../user/userWallet';
import Logo from '../shared/logo';

const Header: FC = () => {
  return (
    <>
      <Grid
        p={4}
        templateColumns={'repeat(6, 1fr)'}
        bg='rgba(0,0,0,0.1)'
        alignItems='center'
      >
        <GridItem colSpan={[1, null, null, 2]}>
          <Logo />
        </GridItem>
        <GridItem display={['none', null, null, 'block']} colSpan={2}>
          <Flex justifyContent='center'>
            <UserBalance />
          </Flex>
        </GridItem>
        <GridItem colSpan={[5, null, null, 2]}>
          <Flex justifyContent='flex-end'>
            <UserWallet />
          </Flex>
        </GridItem>
      </Grid>
      <Flex
        justifyContent='center'
        display={['flex', null, null, 'none']}
        mt={2}
      >
        <UserBalance />
      </Flex>
    </>
  );
};

export default Header;
