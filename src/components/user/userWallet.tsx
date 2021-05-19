import React, { FC } from 'react';
import { HStack } from '@chakra-ui/layout';
import { truncate } from '../../utils/address';
import { Button, IconButton } from '@chakra-ui/react';
import { TiPower } from 'react-icons/ti';
import { VscLink } from 'react-icons/vsc';
import { useWeb3React } from '@web3-react/core';
import { convertChainIdToNetworkName } from '../../utils/convertChainIdToNetworkName';
import { useModal } from '../../store/modals';
import { ModalType } from '../modals/types';
import { injectedConnector } from '../../config';

const UserWallet: FC = () => {
  const { deactivate, account, chainId, connector } = useWeb3React();
  const { openModal } = useModal();

  const isWalletMetamask = connector === injectedConnector;

  const openWalletConnectionModal = () => {
    openModal(ModalType.connectWallet);
  };

  const openWalletInfoModal = () => {
    openModal(ModalType.walletInfo);
  };

  const buttonStyles = {
    borderColor: 'cyan.400',
    borderWidth: '2px',
    variant: 'outline',
  };

  if (account) {
    return (
      <HStack spacing={4}>
        <Button
          {...buttonStyles}
          _hover={{
            ...buttonStyles,
            cursor: 'initial',
          }}
          _active={{
            ...buttonStyles,
          }}
        >
          {convertChainIdToNetworkName(chainId)}
        </Button>
        <Button
          {...buttonStyles}
          pr={isWalletMetamask ? 4 : 12}
          onClick={openWalletInfoModal}
        >
          {truncate(account)}
        </Button>

        {!isWalletMetamask && (
          <IconButton
            isRound
            size='lg'
            height='44px'
            variant='ghost'
            position='absolute'
            right={5}
            icon={<TiPower />}
            aria-label='disconnect'
            onClick={deactivate}
            _hover={{
              bg: 'none',
              color: 'cyan.300',
            }}
          />
        )}
      </HStack>
    );
  }

  return (
    <Button
      {...buttonStyles}
      rightIcon={<VscLink />}
      onClick={openWalletConnectionModal}
    >
      Connect Wallet
    </Button>
  );
};

export default UserWallet;
