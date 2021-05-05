import React, { FC, useState } from 'react';
import {
  Button,
  Flex,
  InputRightElement,
  Link,
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
import { Crucible, useCrucibles } from '../../context/crucibles/crucibles';
import { unstakeAndClaim } from '../../contracts/unstakeAndClaim';
import formatNumber from '../../utils/formatNumber';
import { BigNumber } from 'ethers';
import numberishToBigNumber from '../../utils/numberishToBigNumber';
import bigNumberishToNumber from '../../utils/bigNumberishToNumber';
import getStep from '../../utils/getStep';
import onNumberInputChange from '../../utils/onNumberInputChange';
import { useWeb3React } from '@web3-react/core';

type unstakeAndClaimParams = Parameters<
  (signer: any, crucibleAddress: string, amount: BigNumber) => void
>;

type Props = {
  crucible: Crucible;
  onClose: () => void;
};

const UnstakeAndClaimModal: FC<Props> = ({ onClose, crucible }) => {
  const { cruciblesOnCurrentNetwork } = useCrucibles();
  const { library, chainId } = useWeb3React();
  const [isLoading, setIsLoading] = useState(false);
  const [isMax, setIsMax] = useState(false);
  const [amount, setAmount] = useState('0');
  const amountBigNumber = numberishToBigNumber(amount || 0);
  const lockedBalance = crucible?.lockedBalance || BigNumber.from(0);
  const lockedBalanceNumber = bigNumberishToNumber(lockedBalance);
  const step = getStep(lockedBalanceNumber);

  const { invokeContract, ui } = useContract(unstakeAndClaim, () => {
    onClose();
  });

  const handleUnstakeAndClaim = async () => {
    setIsLoading(true);
    const crucibles = await cruciblesOnCurrentNetwork();
    if (crucibles.length !== 0 && chainId === 1) {
      alert(
        `You have not changed your network yet.

Follow this guide to privately withdraw your stake: https://github.com/Taichi-Network/docs/blob/master/sendPriveteTx_tutorial.md`
      );
      setIsLoading(false);
      return;
    }

    const signer = library?.getSigner();
    invokeContract<unstakeAndClaimParams>(
      signer,
      crucible.id,
      isMax ? lockedBalance : amountBigNumber
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
      <Modal isOpen={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius='xl'>
          <ModalHeader>Claim Aludel rewards and unsubscribe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              You are claiming{' '}
              {formatNumber.tokenFull(crucible.mistRewards || 0)} MIST and{' '}
              {formatNumber.tokenFull(crucible.wethRewards || 0)} Ether rewards.
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
                  href='https://hackmd.io/@alchemistcoin/HyJXT7tL_/%2FSJibHzPUu'
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
