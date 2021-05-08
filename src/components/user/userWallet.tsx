import React, { FC } from 'react';
import { Box } from '@chakra-ui/layout';
import { truncate } from '../../utils/address';
import { Button, IconButton } from '@chakra-ui/react';
import { TiPower } from 'react-icons/ti';
import { VscLink } from 'react-icons/vsc';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';
import { convertChainIdToNetworkName } from '../../utils/convertChainIdToNetworkName';
// @ts-ignore
const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });

const UserWallet: FC = () => {
  const { deactivate, activate, account, chainId } = useWeb3React();

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
        <Box
          mr={5}
          as='button'
          height='24px'
          lineHeight='1.2'
          transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
          border='1px'
          px='8px'
          borderRadius='2px'
          fontSize='14px'
          fontWeight='semibold'
          bg='#f5f6f7'
          borderColor='#ccd0d5'
          color='#4b4f56'
          _hover={{ cursor: 'inherit' }}
        >
          {convertChainIdToNetworkName(chainId)}
        </Box>
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
