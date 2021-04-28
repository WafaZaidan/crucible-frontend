import React, { FC } from 'react';
import {
  Button,
  NumberInput,
  InputRightElement,
  NumberInputField,
  Text,
  Flex,
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

const WithdrawStakeModal: FC<Props> = ({ onClose, crucible }) => {
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
          <ModalHeader>Withdraw Unsubscribed LP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              After you've claimed your rewards and unsubscribed your LP, you
              can withdraw your unsubscribed LP from your Crucible.
            </Text>
            <Flex
              mb={2}
              justifyContent='space-between'
              alignItems='center'
              color='gray.100'
            >
              <Text>Select amount</Text>
              <Text>
                Balance:{' '}
                <strong>
                  {Number(crucible.cleanUnlockedBalance).toFixed(3)} LP
                </strong>
              </Text>
            </Flex>
            <NumberInput
              value={amount}
              onChange={(val) => setAmount(val)}
              max={Number(crucible.cleanUnlockedBalance)}
              clampValueOnBlur={false}
              size='lg'
            >
              <NumberInputField pr='4.5rem' borderRadius='xl' />
              <InputRightElement width='4.5rem'>
                <Button
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
