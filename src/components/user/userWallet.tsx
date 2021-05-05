import React, { FC } from 'react';
import { Box } from '@chakra-ui/layout';
import { truncate } from '../../utils/address';
import { Button, IconButton } from '@chakra-ui/react';
import { TiPower } from 'react-icons/ti';
import { VscLink } from 'react-icons/vsc';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';
// @ts-ignore
const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });

const UserWallet: FC = () => {
  const { deactivate, activate, account } = useWeb3React();

  const handleConnect = async () => {
    // TODO open modal here to let user pick wallet
    activate(injected as any);
  };

  const walletButtonProps = {
    borderColor: 'cyan.400',
    borderWidth: '2px',
    variant: 'outline',
  };

  if (account) {
    return (
      <Box position='relative'>
        <Button {...walletButtonProps} pr={12}>
          <Box>{truncate(account)}</Box>
        </Button>
        <IconButton
          isRound
          size='lg'
          height='44px'
          variant='ghost'
          position='absolute'
          right={0}
          icon={<TiPower />}
          aria-label='disconnect'
          onClick={deactivate}
          _hover={{
            bg: 'none',
            color: 'cyan.300',
          }}
        />
      </Box>
    );
  }

  return (
    <Button
      {...walletButtonProps}
      rightIcon={<VscLink />}
      onClick={handleConnect}
    >
      Connect Wallet
    </Button>
  );
};

export default UserWallet;
