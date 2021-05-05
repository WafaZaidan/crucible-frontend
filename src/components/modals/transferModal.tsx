import React, { FC } from 'react';
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
import { transferCrucible } from '../../contracts/transferCrucible';
import { useState } from 'react';
import { useContract } from '../../hooks/useContract';
import { ethers } from 'ethers';
import { useHistory } from 'react-router';
import { useWeb3React } from '@web3-react/core';

type SendNFTParams = Parameters<
  (signer: any, id: string, sendAddress: string) => void
>;

type Props = {
  id: string;
  onClose: () => void;
};

const TransferModal: FC<Props> = ({ onClose, id }) => {
  const history = useHistory();
  const { library } = useWeb3React();
  const [error, setError] = useState('');
  const [sendAddress, setSendAddress] = useState('');

  const successCallback = () => {
    // TODO: Add indicator to crucible list view to show it's being transferred
    history.push('/');
  };

  const { invokeContract, ui } = useContract(transferCrucible, successCallback);

  const handleTransferCrucible = () => {
    setError('');
    if (ethers.utils.isAddress(sendAddress)) {
      const signer = library?.getSigner();
      invokeContract<SendNFTParams>(signer, id, sendAddress);
      setSendAddress('');
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
      {ui}
    </>
  );
};

export default TransferModal;
