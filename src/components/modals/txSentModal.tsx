import { Button, Flex, Link, Text } from '@chakra-ui/react';
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
import { useWeb3 } from '../../context/web3';
import { networkName } from '../../utils/network';

type Props = {
  onClose: () => void;
  hash: string;
};

const TxSentModal: React.FC<Props> = ({ onClose, hash }) => {
  const { network } = useWeb3();

  const etherscanLink = `https://${networkName(
    network || 1
  )}.etherscan.io/tx/${hash}`;

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius='xl'>
        <ModalHeader textAlign='center'>Transaction submitted</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign='center' py={8}>
          <Flex justifyContent='center' color='yellow.400' pb={2}>
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

export default TxSentModal;
