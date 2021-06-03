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
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/slider';
import { Box } from '@chakra-ui/layout';
import { Crucible } from '../../context/crucibles';
import { BigNumber } from 'ethers';
import formatNumber from '../../utils/formatNumber';
import numberishToBigNumber from '../../utils/numberishToBigNumber';
import bigNumberishToNumber from '../../utils/bigNumberishToNumber';
import getStep from '../../utils/getStep';
import onNumberInputChange from '../../utils/onNumberInputChange';
import { useTransactions } from '../../store/transactions/useTransactions';
import { TxnStatus, TxnType } from '../../store/transactions/types';

type Props = {
  crucible: Crucible;
  onClose: () => void;
};

const WithdrawStakeModal: FC<Props> = ({ onClose, crucible }) => {
  const [isMax, setIsMax] = useState(false);
  const [amount, setAmount] = useState('0');
  const amountBigNumber = numberishToBigNumber(amount || 0);
  const unlockedBalance = crucible?.unlockedBalance || BigNumber.from(0);
  const unlockedBalanceNumber = bigNumberishToNumber(unlockedBalance);
  const step = getStep(unlockedBalanceNumber);
  const { withdraw, transactions } = useTransactions();

  const isWithdrawTxLoading =
    transactions.filter((txn) => {
      return (
        txn.type === TxnType.withdraw && txn.status === TxnStatus.PendingOnChain
      );
    }).length > 0;

  const handleWithdraw = () => {
    withdraw(isMax ? unlockedBalance : amountBigNumber, crucible.id);
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
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius='xl'>
        <ModalHeader>Withdraw Unsubscribed LP</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            After you've claimed your rewards and unsubscribed your LP, you can
            withdraw your unsubscribed LP from your Crucible.
          </Text>
          <Flex
            mb={2}
            justifyContent='space-between'
            alignItems='center'
            color='gray.100'
          >
            <Text>Select amount</Text>
            <Text>
              Balance: <strong>{formatNumber.token(unlockedBalance)} LP</strong>
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
          <Box my={4} mx={4}>
            <Slider
              step={step}
              min={0}
              max={unlockedBalanceNumber}
              value={isMax ? unlockedBalanceNumber : +amount || 0}
              onChange={onChange}
            >
              <SliderTrack>
                <SliderFilledTrack bg='purple.500' />
              </SliderTrack>
              <SliderThumb fontSize='sm' boxSize='18px' bg='purple.500' />
            </Slider>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            loading={isWithdrawTxLoading}
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
  );
};

export default WithdrawStakeModal;
