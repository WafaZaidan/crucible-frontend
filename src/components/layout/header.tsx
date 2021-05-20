import React, { FC } from 'react';
import Logo from '../shared/logo';
import { __PROD__ } from '../../utils/constants';
import { Flex, GridItem, Grid } from '@chakra-ui/layout';
import UserBalance from '../user/userBalance';
import UserWallet from '../user/userWallet';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { useFeatureFlag } from '../../store/featureFlag';
import { Switch } from '@chakra-ui/switch';

const Header: FC = () => {
  const { toggleFlag } = useFeatureFlag();
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
          {!__PROD__ && (
            <FormControl display='flex' alignItems='center'>
              <FormLabel mb='0'>1.3.0-b.3</FormLabel>
              <Switch
                onChange={() => toggleFlag('enableMultipleRewardPrograms')}
              />
            </FormControl>
          )}
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
