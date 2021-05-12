import React, { FC } from 'react';
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useModal } from '../../store/store';

const ReduxModal: FC = () => {
  const { closeModal, isOpen } = useModal();

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent borderRadius='xl'>
          <ModalHeader textAlign='center'>Transfer crucible</ModalHeader>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReduxModal;
