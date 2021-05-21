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
import { useWeb3React } from '@web3-react/core';
import { Button, Flex, Link, Text, useToast } from '@chakra-ui/react';
import { Box, HStack } from '@chakra-ui/layout';
import { ModalType } from './types';
import { useConnectedWalletName } from '../../hooks/useConnectedWalletName';
import { truncate } from '../../utils/address';
import { useClipboard } from '@chakra-ui/hooks';
import {
  BiLinkExternal,
  FiCheckCircle,
  FiCopy,
  RiErrorWarningLine,
} from 'react-icons/all';
import { Spinner } from '@chakra-ui/spinner';
import { useTransactions } from '../../store/transactions/reducer';
import { TxnStatus } from '../../store/transactions/types';

const convertTxnStatusToIcon = (status?: TxnStatus) => {
  switch (status) {
    case TxnStatus.Failed:
      return <RiErrorWarningLine size='20px' color='rgba(229, 62, 62)' />;
    case TxnStatus.Mined:
      return <FiCheckCircle size='20px' color='green' />;
    case TxnStatus.Initiated:
    case TxnStatus.PendingApproval:
    case TxnStatus.PendingOnChain:
      return <Spinner />;
    // this should not happen
    case TxnStatus.Ready:
      return '';
  }
};

const WalletInfoModal: FC = () => {
  const { closeModal, openModal, isOpen } = useModal();
  const { deactivate, account, chainId } = useWeb3React();
  const walletName = useConnectedWalletName();
  const toast = useToast();

  const openWalletConnectModal = async () => {
    await deactivate();
    openModal(ModalType.connectWallet);
  };

  let { hasCopied, onCopy } = useClipboard(account || '');

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: `Copied ${walletName} address`,
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCopied]);

  const etherscanAddressLink = `https://etherscan.io/address/${account}`;

  const etherscanTxLink = (hash: string) =>
    chainId === 1
      ? `https://etherscan.io/tx/${hash}`
      : `https://rinkeby.etherscan.io/tx/${hash}`;

  const { pendingTransactions, completedTransactions } = useTransactions();
  const txnsToDisplay = [...pendingTransactions, ...completedTransactions];

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent borderRadius='xl'>
          <ModalHeader textAlign='center'>Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={10}>
            <Flex justifyContent='space-between'>
              <Text>Connected with {walletName}</Text>
              <Button onClick={openWalletConnectModal} size='xs'>
                Change
              </Button>
            </Flex>
            <Box mt={5} p={4} bg='white' color='gray.800' borderRadius='xl'>
              <HStack mb={3}>
                <FiCheckCircle color='green' />
                <Text fontSize='xl' mb={5}>
                  {truncate(account || '')}
                </Text>
              </HStack>
              <HStack>
                <HStack mr={5}>
                  <FiCopy />
                  <Link onClick={onCopy}>Copy Address</Link>
                </HStack>
                <HStack>
                  <BiLinkExternal />
                  <Link isExternal href={etherscanAddressLink}>
                    View on Etherscan
                  </Link>
                </HStack>
              </HStack>
            </Box>
            {txnsToDisplay.length > 0 && (
              <Box mt={5} p={4} bg='white' color='gray.800' borderRadius='xl'>
                <Flex justifyContent='space-between' mb={3}>
                  <Text fontWeight='bold'>Your Recent Transactions</Text>
                  {/* <Button size='xs'>Clear All</Button> */}
                </Flex>
                {txnsToDisplay.map((txn) => (
                  <>
                    <Flex
                      justifyContent='space-between'
                      py={1}
                      pl={3}
                      pr={2}
                      mb={3}
                      borderBottom='1px solid #EDF2F7'
                    >
                      <Box maxW='300px'>
                        {txn.hash ? (
                          <Link
                            color='blue.400'
                            href={etherscanTxLink(txn.hash)}
                          >
                            {txn.description}
                          </Link>
                        ) : (
                          <Text>{txn.description}</Text>
                        )}
                      </Box>
                      {convertTxnStatusToIcon(txn.status)}
                    </Flex>
                  </>
                ))}
              </Box>
            )}
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

export default WalletInfoModal;
