import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';

type Props = {
  step: number;
};

const TxProgressModal: React.FC<Props> = ({ step }) => {
  return (
    <>
      <Modal isOpen={true} onClose={() => null}>
        <ModalOverlay />
        <ModalContent borderRadius='xl'>
          <ModalHeader textAlign='center'>
            {step === 3 ? 'Waiting for confirmation' : 'Waiting for signature'}
          </ModalHeader>
          <ModalBody>
            <Center my={8}>
              <Spinner width={24} height={24} />
            </Center>
            <Box textAlign='center' color='gray.200' my={4}>
              {step === 3 ? (
                <Text>Confirm this transaction in your wallet</Text>
              ) : (
                <Text>
                  Please sign signature <strong>{step}</strong> of{' '}
                  <strong>2</strong>
                </Text>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TxProgressModal;
