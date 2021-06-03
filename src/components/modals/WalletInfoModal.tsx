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
import { Button, Flex, Link, Tag, Text, useToast } from '@chakra-ui/react';
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
import { useTransactions } from '../../store/transactions/useTransactions';
import { TxnStatus } from '../../store/transactions/types';
import { convertChainIdToNetworkName } from '../../utils/convertChainIdToNetworkName';
import { Tooltip } from '@chakra-ui/tooltip';

const convertTxnStatusToIcon = (status?: TxnStatus) => {
  switch (status) {
    case TxnStatus.Failed:
      return <RiErrorWarningLine size='23px' color='rgba(229, 62, 62)' />;
    case TxnStatus.Mined:
      return <FiCheckCircle size='20px' color='green' />;
    case TxnStatus.PendingOnChain:
      return (
        <Spinner
          size='md'
          thickness='2px'
          speed='0.65s'
          emptyColor='gray.100'
          color='blue.400'
        />
      );

    // these txns should be filtered out
    case TxnStatus.Initiated:
    case TxnStatus.PendingApproval:
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

  const { transactions, clearSavedTransactions } = useTransactions();

  const txnsToDisplay = transactions.filter(
    (txn) =>
      txn.status === TxnStatus.Failed ||
      txn.status === TxnStatus.PendingOnChain ||
      txn.status === TxnStatus.Mined
  );

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
              <Tag size='sm' colorScheme='blue'>
                {convertChainIdToNetworkName(chainId)}
              </Tag>
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
                  <Button onClick={clearSavedTransactions} size='xs'>
                    Clear All
                  </Button>
                </Flex>
                {txnsToDisplay.map((txn, i) => (
                  <Flex
                    columns={2}
                    spacing={5}
                    key={`${txn.type}-${i}`}
                    w='100%'
                    justifyContent='space-between'
                    mb={3}
                    pb={2}
                    borderBottom='1px solid'
                    borderColor='lightGray'
                  >
                    <Box>
                      <Tag mr={2} size='sm' colorScheme='blue'>
                        {txn.type}
                      </Tag>
                      {txn.hash ? (
                        <Link
                          isExternal
                          color='blue.400'
                          href={etherscanTxLink(txn.hash || '')}
                        >
                          {txn.description}
                        </Link>
                      ) : (
                        <Text display='inline-block'>{txn.description}</Text>
                      )}
                    </Box>
                    <Box w='30px' ml={5}>
                      {txn.status === TxnStatus.Failed ? (
                        <Tooltip
                          hasArrow
                          label={`${txn.error?.substr(0, 100)}...`}
                          bg='gray.800'
                          color='white'
                          placement='top'
                        >
                          <div>{convertTxnStatusToIcon(txn.status)}</div>
                        </Tooltip>
                      ) : (
                        convertTxnStatusToIcon(txn.status)
                      )}
                    </Box>
                  </Flex>
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
