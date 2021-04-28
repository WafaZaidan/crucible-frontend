import React, { FC } from 'react';
import {
  Button,
  NumberInput,
  NumberInputField,
  Text,
  InputRightElement,
  Link,
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
import { unstakeAndClaim } from '../../contracts/unstakeAndClaim';

type unstakeAndClaimParams = Parameters<
  (signer: any, crucibleAddress: string, rawAmount: string) => void
>;

type Props = {
  crucible: Crucible;
  onClose: () => void;
};

const UnstakeAndClaimModal: FC<Props> = ({ onClose, crucible }) => {
  const { provider } = useWeb3();
  const [amount, setAmount] = useState('0');

  const { invokeContract, ui } = useContract(unstakeAndClaim, () => onClose());

  const handleUnstakeAndClaim = () => {
    const signer = provider?.getSigner();
    invokeContract<unstakeAndClaimParams>(signer, crucible.id, amount);
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
              You are claiming {crucible.tokenRewards || '0'} MIST and{' '}
              {crucible.ethRewards} Ether rewards. By claiming rewards, you are
              unsubscribing your MIST-ETH LP tokens from the Aludel Rewards
              program and resetting your rewards multiplier.
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
                Balance:{' '}
                <strong>
                  {Number(crucible.cleanLockedBalance).toFixed(3)} LP
                </strong>
              </Text>
            </Flex>
            <NumberInput
              value={amount}
              onChange={(val) => setAmount(val)}
              max={Number(crucible.cleanLockedBalance)}
              clampValueOnBlur={false}
              size='lg'
            >
              <NumberInputField pr='4.5rem' borderRadius='xl' />
              <InputRightElement width='4.5rem'>
                <Button
                  variant='ghost'
                  onClick={() => setAmount(crucible.cleanLockedBalance || '0')}
                >
                  Max
                </Button>
              </InputRightElement>
            </NumberInput>
          </ModalBody>
          <ModalFooter>
            <Button
              isFullWidth
              onClick={handleUnstakeAndClaim}
              disabled={
                !amount ||
                Number(amount) === 0 ||
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
