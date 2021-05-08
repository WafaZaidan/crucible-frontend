import React, { FC, useState } from 'react';
import {
  Button,
  Flex,
  InputRightElement,
  NumberInput,
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
import { useContract } from '../../hooks/useContract';
import { Crucible } from '../../context/crucibles/crucibles';
import { withdraw } from '../../contracts/withdraw';
import { BigNumber } from 'ethers';
import formatNumber from '../../utils/formatNumber';
import numberishToBigNumber from '../../utils/numberishToBigNumber';
import bigNumberishToNumber from '../../utils/bigNumberishToNumber';
import getStep from '../../utils/getStep';
import onNumberInputChange from '../../utils/onNumberInputChange';
import { useWeb3React } from '@web3-react/core';

type withdrawParams = Parameters<
  (signer: any, crucibleAddress: string, amount: BigNumber) => void
>;

type Props = {
  crucible: Crucible;
  onClose: () => void;
};

const WithdrawStakeModal: FC<Props> = ({ onClose, crucible }) => {
  const { library } = useWeb3React();
  const [isMax, setIsMax] = useState(false);
  const [amount, setAmount] = useState('0');
  const amountBigNumber = numberishToBigNumber(amount || 0);
  const unlockedBalance = crucible?.unlockedBalance || BigNumber.from(0);
  const unlockedBalanceNumber = bigNumberishToNumber(unlockedBalance);
  const step = getStep(unlockedBalanceNumber);

  const { invokeContract, ui } = useContract(withdraw, () => onClose());

  const handleWithdraw = () => {
    const signer = library?.getSigner();
    invokeContract<withdrawParams>(
      signer,
      crucible.id,
      isMax ? unlockedBalance : amountBigNumber
    );
  };

  const onChange = (amountNew: number | string) => {
    onNumberInputChange(
      amountNew,
      amount,
      unlockedBalance,
      isMax,
      setAmount,
      setIsMax
    );
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
                <strong>{formatNumber.token(unlockedBalance)} LP</strong>
              </Text>
            </Flex>
            <NumberInput
              value={isMax ? unlockedBalanceNumber.toString() : amount}
              onChange={onChange}
              step={step}
              min={0}
              max={unlockedBalanceNumber}
              clampValueOnBlur={false}
              size='lg'
            >
              <NumberInputField pr='4.5rem' borderRadius='xl' />
              <InputRightElement width='4.5rem'>
                <Button variant='ghost' onClick={() => setIsMax(true)}>
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
                (!isMax || unlockedBalance.lte(0)) &&
                (amountBigNumber.lte(0) || amountBigNumber.gt(unlockedBalance))
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
