import { FC } from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';
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

type Props = {
  onClose: () => void;
  message?: string;
};

const TxConfirmedFlashbotsModal: FC<Props> = ({ onClose, message }) => {
  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius='xl'>
        <ModalHeader textAlign='center'>Transaction successful!</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign='center' py={8}>
          <Flex justifyContent='center' color='white' pb={2}>
            <IoArrowUpCircleOutline fontSize='80px' />
          </Flex>
          <Text color='gray.200'>{message}</Text>
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

export default TxConfirmedFlashbotsModal;
