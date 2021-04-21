import {
  Button,
  NumberInput,
  InputRightElement,
  NumberInputField,
  Text,
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
import { useState } from 'react';
import { useWeb3 } from '../../context/web3';
import { useContract } from '../../hooks/useContract';
import { Crucible } from '../../context/crucibles/crucibles';
import { withdraw } from '../../contracts/withdraw';

type withdrawParams = Parameters<
  (signer: any, crucibleAddress: string, rawAmount: string) => void
>;

type Props = {
  crucible: Crucible;
  onClose: () => void;
};

const WithdrawStakeModal: React.FC<Props> = ({ onClose, crucible }) => {
  const { provider } = useWeb3();
  const [amount, setAmount] = useState('0');

  const { invokeContract, ui } = useContract(withdraw, () => onClose());

  const handleWithdraw = () => {
    const signer = provider?.getSigner();
    invokeContract<withdrawParams>(signer, crucible.id, amount);
  };

  return (
    <>
      <Modal isOpen={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius='xl'>
          <ModalHeader textAlign='center'>Withdraw LP tokens</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign='center'>
            <Text mb={4}>
              After you've unstaked your LP and claimed your rewards, you can
              withdraw your LP balance from your crucible.
            </Text>
            <NumberInput
              value={amount}
              onChange={(val) => setAmount(val)}
              max={Number(crucible.cleanUnlockedBalance)}
              clampValueOnBlur={false}
              size='lg'
            >
              <NumberInputField />
              <InputRightElement width='4.5rem' zIndex={0}>
                <Button
                  mr={2}
                  h='2rem'
                  variant='ghost'
                  onClick={() =>
                    setAmount(crucible.cleanUnlockedBalance || '0')
                  }
                >
                  Max
                </Button>
              </InputRightElement>
            </NumberInput>
          </ModalBody>
          <ModalFooter>
            <Button
              isFullWidth
              onClick={handleWithdraw}
              disabled={
                !amount ||
                amount === '0' ||
                Number(amount) > Number(crucible.cleanUnlockedBalance)
              }
            >
              Withdraw
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {ui}
    </>
  );
};

export default WithdrawStakeModal;
