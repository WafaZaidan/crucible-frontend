import React, { FC } from 'react';
import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';

type Props = {
  message?: string;
};

const TxPendingFlashbotsModal: FC<Props> = () => {
  return (
    <>
      <Modal isOpen={true} onClose={() => null}>
        <ModalOverlay />
        <ModalContent borderRadius='xl'>
          <ModalHeader textAlign='center'>
            Bundling transaction via Flashbots...
          </ModalHeader>
          <ModalBody>
            <Center my={8}>
              <Spinner width={24} height={24} />
            </Center>
            <Box textAlign='center' color='gray.200' my={4}>
              <Text>
                This process may take up to 5 minutes. Please do not close the
                window. No gas will be charged if this transaction fails. Please
                retry if unsuccessful.
              </Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TxPendingFlashbotsModal;
