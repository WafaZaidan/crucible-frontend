import React, { FC } from 'react';
import { HStack } from '@chakra-ui/layout';
import { truncate } from '../../utils/address';
import { Box, Button, IconButton, Tag } from '@chakra-ui/react';
import { TiPower } from 'react-icons/ti';
import { VscLink } from 'react-icons/vsc';
import { useWeb3React } from '@web3-react/core';
import { convertChainIdToNetworkName } from '../../utils/convertChainIdToNetworkName';
import { useModal } from '../../store/modals';
import { ModalType } from '../modals/types';
import { injectedConnector } from '../../config';
import { useTransactions } from '../../store/transactions/useTransactions';
import { TxnStatus } from '../../store/transactions/types';

const UserWallet: FC = () => {
  const { deactivate, account, chainId, connector } = useWeb3React();
  const { openModal } = useModal();
  const { transactions } = useTransactions();
  const isWalletMetamask = connector === injectedConnector;

  const pendingTransactions = transactions.filter(
    (txn) => txn.status === TxnStatus.PendingOnChain
  );

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
        <Box position='relative'>
          <Button
            {...buttonStyles}
            pr={isWalletMetamask ? 4 : 12}
            onClick={openWalletInfoModal}
          >
            {truncate(account)}
          </Button>
          {pendingTransactions.length > 0 && (
            <Tag
              onClick={openWalletInfoModal}
              colorScheme='red'
              size='sm'
              variant='solid'
              position='absolute'
              borderRadius='full'
              left='-5px'
              top='-5px'
              bgColor='rgba(229, 62, 62)'
              cursor='pointer'
            >
              {pendingTransactions.length}
            </Tag>
          )}
        </Box>

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
