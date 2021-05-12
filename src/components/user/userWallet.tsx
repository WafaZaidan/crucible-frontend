import React, { FC } from 'react';
import { Box } from '@chakra-ui/layout';
import { truncate } from '../../utils/address';
import { Button, IconButton } from '@chakra-ui/react';
import { TiPower } from 'react-icons/ti';
import { VscLink } from 'react-icons/vsc';
import { useWeb3React } from '@web3-react/core';
import { convertChainIdToNetworkName } from '../../utils/convertChainIdToNetworkName';
import { useModal } from '../../store/modals';
import { ModalType } from '../modals/types';

const UserWallet: FC = () => {
  const { deactivate, account, chainId } = useWeb3React();
  const { openModal } = useModal();

  const openWalletConnectionModal = () => {
    openModal(ModalType.connectWallet);
  };

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
