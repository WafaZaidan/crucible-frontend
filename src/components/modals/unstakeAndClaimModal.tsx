import React, { FC, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import {
  Button,
  Flex,
  InputRightElement,
  Link,
  ListItem,
  NumberInput,
  NumberInputField,
  Text,
  UnorderedList,
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
import { Box } from '@chakra-ui/layout';
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/slider';
import { Crucible, useCrucibles } from '../../context/crucibles';
import formatNumber from '../../utils/formatNumber';
import numberishToBigNumber from '../../utils/numberishToBigNumber';
import bigNumberishToNumber from '../../utils/bigNumberishToNumber';
import getStep from '../../utils/getStep';
import onNumberInputChange from '../../utils/onNumberInputChange';
import { parseUnits } from '@ethersproject/units';
import { useTransactions } from '../../store/transactions/useTransactions';
import { TxnStatus, TxnType } from '../../store/transactions/types';

type Props = {
  crucible: Crucible;
  subscriptionBoundaries: BigNumber[];
  onClose: () => void;
};

const UnstakeAndClaimModal: FC<Props> = ({
  onClose,
  crucible,
  subscriptionBoundaries,
}) => {
  const { cruciblesOnCurrentNetwork } = useCrucibles();
  const { chainId } = useWeb3React();
  const [isMax, setIsMax] = useState(false);
  const [amount, setAmount] = useState('0');
  const amountBigNumber = numberishToBigNumber(amount || 0);
  const lockedBalance = crucible?.lockedBalance || BigNumber.from(0);
  const lockedBalanceNumber = bigNumberishToNumber(lockedBalance);
  const step = getStep(lockedBalanceNumber);

  const { unsubscribeLP, savedTransactions } = useTransactions();

  const isUnstakeTxnPending =
    savedTransactions.filter((txn) => {
      return (
        txn.type === TxnType.unsubscribe &&
        (txn.status === TxnStatus.Initiated ||
          txn.status === TxnStatus.PendingApproval ||
          txn.status === TxnStatus.PendingOnChain)
      );
    }).length > 0;

  console.log(savedTransactions);
  console.log(isUnstakeTxnPending);

  const handleUnstakeAndClaim = async () => {
    const crucibles = await cruciblesOnCurrentNetwork();

    if (crucibles.length !== 0 && chainId === 1) {
      alert(
        `You have not changed your network yet.

Follow this guide to privately withdraw your stake: https://github.com/Taichi-Network/docs/blob/master/sendPriveteTx_tutorial.md`
      );
      return;
    }

    let needsAdjustment = false;

    const setNeedsAdjustment = () => {
      needsAdjustment = true;
    };

    const adjust = (value: BigNumber) => {
      if (needsAdjustment) {
        return value.add(parseUnits('1', 'wei'));
      }
      return value;
    };

    if (isMax) {
      subscriptionBoundaries.some((boundary) => boundary.eq(lockedBalance)) &&
        setNeedsAdjustment();
    } else {
      subscriptionBoundaries.some((boundary) => boundary.eq(amountBigNumber)) &&
        setNeedsAdjustment();
    }

    unsubscribeLP(isMax ? lockedBalance : adjust(amountBigNumber), crucible.id);
  };

  const onChange = (amountNew: number | string) => {
    onNumberInputChange(
      amountNew,
      amount,
      lockedBalance,
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
          <ModalHeader>Claim Aludel rewards and unsubscribe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>You are claiming the following rewards:</Text>
            <UnorderedList mb={4}>
              <ListItem>
                {formatNumber.tokenFull(crucible.mistRewards || 0)} MIST
              </ListItem>
              <ListItem>
                {formatNumber.tokenFull(crucible.wethRewards || 0)} ETH
              </ListItem>
            </UnorderedList>
            <Text>
              By claiming rewards, you are unsubscribing your MIST-ETH LP tokens
              from the Aludel Rewards program and resetting your rewards
              multiplier.
              <br />
              <br />
              <b>
                Before unsubscribing, you'll need to add a new network provider
                (Taichi) to your wallet following{' '}
                <Link
                  color='blue.400'
                  href='https://docs.alchemist.wtf/mist/crucible/guides-crucible.alchemist.wtf/claiming-rewards-and-unsubscribing-your-lp'
                  isExternal
                >
                  this guide.
                </Link>
              </b>
              <br />
            </Text>
            <Flex
              mb={2}
              justifyContent='space-between'
              alignItems='center'
              color='gray.100'
            >
              <Text>Select amount</Text>
              <Text>
                Balance: <strong>{formatNumber.token(lockedBalance)} LP</strong>
              </Text>
            </Flex>
            <NumberInput
              value={isMax ? lockedBalanceNumber.toString() : amount}
              onChange={onChange}
              step={step}
              min={0}
              max={lockedBalanceNumber}
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
                max={lockedBalanceNumber}
                value={isMax ? lockedBalanceNumber : +amount || 0}
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
              isFullWidth
              isLoading={isUnstakeTxnPending}
              onClick={handleUnstakeAndClaim}
              disabled={
                (!isMax || lockedBalance.lte(0)) &&
                (amountBigNumber.lte(0) || amountBigNumber.gt(lockedBalance))
              }
            >
              Claim rewards and unsubscribe LP
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UnstakeAndClaimModal;
