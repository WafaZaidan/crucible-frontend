import React, { FC, useEffect } from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useModal } from '../../store/modals';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { isMobile } from 'react-device-detect';
import MMLogo from '../../img/metamask-logo.png';
import PortisLogo from '../../img/portis-logo.png';
import CoinbaseLogo from '../../img/coinbase-logo.png';
import WalletConnectLogo from '../../img/walletconnect-logo.svg';
import { useWeb3React } from '@web3-react/core';
import { Text, Button, Image, Link, Flex, VStack } from '@chakra-ui/react';
import {
  injectedConnector,
  walletconnectConnector,
  portisConnector,
  walletlinkConnector,
} from '../../config';

const ConnectWalletModal: FC = () => {
  const { closeModal, isOpen } = useModal();
  const { activate, active } = useWeb3React();

  const attemptActivation = (connector: AbstractConnector) => {
    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
    ) {
      connector.walletConnectProvider = undefined;
    }

    activate(connector);
  };

  const handleMetaMaskConnection = () => {
    //@ts-ignore
    if (window.ethereum && window.ethereum.isMetaMask) {
      attemptActivation(injectedConnector);
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (active) {
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent borderRadius='xl'>
          <ModalHeader textAlign='center'>Connect Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={10}>
            <VStack spacing={4}>
              {!isMobile && (
                <Button
                  isFullWidth
                  onClick={handleMetaMaskConnection}
                  leftIcon={<Image w='30px' h='30px' src={MMLogo} />}
                >
                  MetaMask
                </Button>
              )}
              <Button
                isFullWidth
                onClick={() => attemptActivation(walletconnectConnector)}
                leftIcon={<Image w='30px' h='30px' src={WalletConnectLogo} />}
              >
                WalletConnect
              </Button>
              {!isMobile && (
                <Button
                  isFullWidth
                  onClick={() => attemptActivation(portisConnector)}
                  leftIcon={<Image w='30px' h='30px' src={PortisLogo} />}
                >
                  Portis
                </Button>
              )}
              <Button
                isFullWidth
                onClick={() => attemptActivation(walletlinkConnector)}
                leftIcon={<Image w='30px' h='30px' src={CoinbaseLogo} />}
              >
                Coinbase
              </Button>
            </VStack>
          </ModalBody>
          <Flex p={5} justifyContent='center'>
            <Text>
              New to Ethereum?{' '}
              <Link
                color='blue.400'
                href='https://ethereum.org/en/wallets/'
                isExternal
              >
                Learn more about wallets
              </Link>
            </Text>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConnectWalletModal;
