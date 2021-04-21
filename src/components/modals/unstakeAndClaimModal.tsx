import { Button, NumberInput, NumberInputField, Text } from '@chakra-ui/react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useState } from 'react';
import { useWeb3 } from '../../context/web3';
import { useContract } from '../../hooks/useContract';
import { Crucible } from '../../context/crucibles/crucibles';
import { unstakeAndClaim } from '../../contracts/unstakeAndClaim';

type unstakeAndClaimParams = Parameters<
  (signer: any, crucibleAddress: string, rawAmount: string) => void
>;

type Props = {
  crucible: Crucible;
  onClose: () => void;
};

const UnstakeAndClaimModal: React.FC<Props> = ({ onClose, crucible }) => {
  const { provider } = useWeb3();
  const [amount, setAmount] = useState('0');

  const { invokeContract, ui } = useContract(unstakeAndClaim, () => onClose());

  const handleUnstakeAndClaim = async () => {
    const signer = provider?.getSigner();
    invokeContract<unstakeAndClaimParams>(signer, crucible.id, amount);
  };

  return (
    <>
      <Modal isOpen={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius='xl'>
          <ModalHeader textAlign='center'>
            Claim Aludel Rewards and Unsubscribe LP
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign='center'>
            <Text mb={4}>
              You are claiming {crucible.tokenRewards} MIST and{' '}
              {crucible.ethRewards} Ether rewards. Claiming rewards results in
              unsubscribing your MIST-ETH LP tokens from the Aludel Rewards
              program and resetting your rewards multiplier.
            </Text>
            <NumberInput
              value={amount}
              onChange={(val) => setAmount(val)}
              max={Number(crucible.cleanLockedBalance)}
              clampValueOnBlur={false}
              size='lg'
            >
              <NumberInputField />
            </NumberInput>
          </ModalBody>
          <ModalFooter>
            <Button
              isFullWidth
              onClick={handleUnstakeAndClaim}
              disabled={
                !amount ||
                amount === '0' ||
                Number(amount) > Number(crucible.cleanLockedBalance)
              }
            >
              Claim rewards and unsubscribe LP
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {ui}
    </>
  );
};

export default UnstakeAndClaimModal;
