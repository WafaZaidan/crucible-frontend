import React, { FC, useState } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { ethers } from 'ethers';
import { useTransactions } from '../../store/transactions/useTransactions';

type Props = {
  id: string;
  onClose: () => void;
};

const TransferModal: FC<Props> = ({ onClose, id }) => {
  const [error, setError] = useState('');
  const [sendAddress, setSendAddress] = useState('');

  const { transferCrucible } = useTransactions();

  const handleTransferCrucible = () => {
    setError('');
    if (ethers.utils.isAddress(sendAddress)) {
      transferCrucible(id, sendAddress);
      onClose();
      window.scrollTo(0, 0);
    } else {
      setError('Invalid wallet address');
    }
  };

  return (
    <>
      <Modal isOpen={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius='xl'>
          <ModalHeader textAlign='center'>Transfer crucible</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign='center'>
            <FormControl isInvalid={!!error}>
              <FormLabel htmlFor='address'>Recipient address</FormLabel>
              <Input
                id='address'
                placeholder='Address'
                onChange={(e) => setSendAddress(e.target.value)}
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button isFullWidth onClick={handleTransferCrucible}>
              Transfer crucible
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TransferModal;
