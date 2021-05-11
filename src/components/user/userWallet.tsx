import React, { FC } from 'react';
import { Box } from '@chakra-ui/layout';
import { truncate } from '../../utils/address';
import {
  Button,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';
import { TiPower } from 'react-icons/ti';
import { VscLink } from 'react-icons/vsc';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { useWeb3React } from '@web3-react/core';
import { convertChainIdToNetworkName } from '../../utils/convertChainIdToNetworkName';
import MMLogo from '../../img/metamask-logo.png';
import WalletConnectLogo from '../../img/walletconnect-logo.svg';
import styled from '@emotion/styled';

// @ts-ignore
const injected = new InjectedConnector({ supportedChainIds: [1, 4] });

const walletconnect = new WalletConnectConnector({
  rpc: {
    1: 'https://mainnet.infura.io/v3/00a5b13ef0cf467698571093487743e6',
    4: 'https://rinkeby.infura.io/v3/00a5b13ef0cf467698571093487743e6',
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 12000,
});

const WalletProviderLogo = styled.img`
  width: 40px;
`;

const UserWallet: FC = () => {
  const { deactivate, activate, account, chainId } = useWeb3React();

  const buttonStyles = {
    borderColor: 'cyan.400',
    borderWidth: '2px',
    variant: 'outline',
  };

  if (account) {
    return (
      <Box position='relative'>
        <Button {...buttonStyles} mr={5}>
          {convertChainIdToNetworkName(chainId)}
        </Button>
        <Button {...buttonStyles} pr={12}>
          {truncate(account)}
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
    <Popover placement='bottom'>
      <PopoverTrigger>
        <Button {...buttonStyles} rightIcon={<VscLink />}>
          Connect Wallet
        </Button>
      </PopoverTrigger>
      <PopoverContent color='white' bg='blue.800' borderColor='blue.800'>
        <PopoverHeader pt={4} fontWeight='bold' border='0'>
          Select your wallet provider
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Button
            onClick={() => activate(injected)}
            width='100%'
            {...buttonStyles}
            leftIcon={<WalletProviderLogo src={MMLogo} />}
            mb={5}
          >
            Metamask
          </Button>
          <Button
            onClick={() => activate(walletconnect)}
            width='100%'
            {...buttonStyles}
            leftIcon={<WalletProviderLogo src={WalletConnectLogo} />}
          >
            WalletConnect
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default UserWallet;
