import { FC } from 'react';
import { Button, Flex, Text, Link } from '@chakra-ui/react';
import { IoArrowUpCircleOutline } from 'react-icons/io5';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useWeb3React } from '@web3-react/core';

type Props = {
  onClose: () => void;
  message?: string;
  hash: string;
};

const TxConfirmedModal: FC<Props> = ({ onClose, hash }) => {
  const { chainId } = useWeb3React();

  const etherscanLink =
    chainId === 1
      ? `https://etherscan.io/tx/${hash}`
      : `https://rinkeby.etherscan.io/tx/${hash}`;

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius='xl'>
        <ModalHeader textAlign='center'>Transaction submitted</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign='center' py={8}>
          <Flex justifyContent='center' color='white' pb={2}>
            <IoArrowUpCircleOutline fontSize='80px' />
          </Flex>
          <Text color='gray.200'>
            <Link
              isExternal
              color='blue.400'
              fontWeight='bold'
              href={etherscanLink}
            >
              View on Etherscan
            </Link>
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} isFullWidth>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TxConfirmedModal;
