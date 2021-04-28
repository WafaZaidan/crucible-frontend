import React, { FC } from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';
import { IoWarningOutline } from 'react-icons/io5';
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
  code?: number;
};

const TxErrorModal: FC<Props> = ({ onClose, message, code }) => {
  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius='xl'>
        <ModalHeader textAlign='center'>Error</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign='center' py={8}>
          <Flex justifyContent='center' color='red.400' pb={2}>
            <IoWarningOutline fontSize='56px' />
          </Flex>
          <Text color='gray.200'>
            {code === 4001 ? 'Transaction rejected' : message}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            isFullWidth
            bg='red.400'
            onClick={onClose}
            _hover={{ bg: 'red.300' }}
            _active={{ bg: 'red.300' }}
          >
            Dismiss
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TxErrorModal;
