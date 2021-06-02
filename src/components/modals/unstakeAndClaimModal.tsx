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
import { useContract } from '../../hooks/useContract';
import { Crucible, useCrucibles } from '../../context/crucibles';
import formatNumber from '../../utils/formatNumber';
import numberishToBigNumber from '../../utils/numberishToBigNumber';
import bigNumberishToNumber from '../../utils/bigNumberishToNumber';
import getStep from '../../utils/getStep';
import onNumberInputChange from '../../utils/onNumberInputChange';
import useContracts from '../../contracts/useContracts';
import { parseUnits } from '@ethersproject/units';
import { useModal } from '../../store/modals';

type unstakeAndClaimParams = Parameters<
  (signer: any, crucibleAddress: string, amount: BigNumber) => void
>;

type Props = {
  crucible: Crucible;
  subscriptionBoundaries: BigNumber[];
};

const UnstakeAndClaimModal: FC<Props> = ({
  crucible,
  subscriptionBoundaries,
}) => {
  const { closeModal } = useModal();
  const { cruciblesOnCurrentNetwork } = useCrucibles();
  const { library, chainId } = useWeb3React();
  const [isLoading, setIsLoading] = useState(false);
  const [isMax, setIsMax] = useState(false);
  const [amount, setAmount] = useState('0');
  const amountBigNumber = numberishToBigNumber(amount || 0);
  const lockedBalance = crucible?.lockedBalance || BigNumber.from(0);
  const lockedBalanceNumber = bigNumberishToNumber(lockedBalance);
  const step = getStep(lockedBalanceNumber);
  const { unstakeAndClaim } = useContracts();

  const { invokeContract, ui } = useContract(unstakeAndClaim, () => {
    closeModal();
  });

  const handleUnstakeAndClaim = async () => {
    setIsLoading(true);

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

    const signer = library?.getSigner();
    invokeContract<unstakeAndClaimParams>(
      signer,
      crucible.id,
      isMax ? lockedBalance : adjust(amountBigNumber)
    );
    setIsLoading(false);
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
      <Modal isOpen={true} onClose={() => closeModal()}>
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
                You must use Metamask for this process. Hardware wallets are
                also unsupported (i.e. Ledger, Trezor).
              </b>
              <br />
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
              isLoading={isLoading}
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
      {ui}
    </>
  );
};

export default UnstakeAndClaimModal;
