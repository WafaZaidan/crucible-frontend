import React, { FC, useEffect } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useModal } from '../../store/modals';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import MMLogo from '../../img/metamask-logo.png';
import WalletConnectLogo from '../../img/walletconnect-logo.svg';
import { useWeb3React } from '@web3-react/core';
import {
  Text,
  Button,
  Image,
  Link,
  ModalFooter,
  Box,
  Flex,
} from '@chakra-ui/react';

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

const ConnectWallet: FC = () => {
  const { closeModal, isOpen } = useModal();
  const { activate, active } = useWeb3React();

  useEffect(() => {
    if (active) {
      closeModal();
    }
  }, [active]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent borderRadius='xl'>
          <ModalHeader textAlign='center'>Connect Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={10}>
            <Button
              onClick={() => activate(injected)}
              width='100%'
              leftIcon={<Image w='30px' src={MMLogo} />}
              mb={5}
            >
              Metamask
            </Button>
            <Button
              onClick={() => activate(walletconnect)}
              width='100%'
              leftIcon={<Image w='30px' src={WalletConnectLogo} />}
            >
              WalletConnect
            </Button>
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

export default ConnectWallet;
