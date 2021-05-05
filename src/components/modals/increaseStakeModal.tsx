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
import { useWeb3 } from '../../context/web3';
import { useContract } from '../../hooks/useContract';
import { Crucible, useCrucibles } from '../../context/crucibles/crucibles';
import { increaseStake } from '../../contracts/increaseStake';
import { config } from '../../config/variables';
import formatNumber from '../../utils/formatNumber';
import { BigNumber } from 'ethers';
import bigNumberishToNumber from '../../utils/bigNumberishToNumber';
import numberishToBigNumber from '../../utils/numberishToBigNumber';
import getStep from '../../utils/getStep';
import onNumberInputChange from '../../utils/onNumberInputChange';

type IncreaseStakeParams = Parameters<
  (signer: any, crucibleAddress: string, amount: BigNumber) => void
>;

type Props = {
  crucible: Crucible;
  onClose: () => void;
};

const IncreaseStakeModal: FC<Props> = ({ onClose, crucible }) => {
  const { provider } = useWeb3();
  const [isMax, setIsMax] = useState(false);
  const [amount, setAmount] = useState('0');
  const amountBigNumber = numberishToBigNumber(amount || 0);

  const successCallback = (txHash: string) => {
    // Hacky
    localStorage.setItem('inFlightSubscriptionHash', txHash);
    onClose();
  };

  const { invokeContract, ui } = useContract(increaseStake, (txHash: string) =>
    successCallback(txHash)
  );
  const { tokenBalances } = useCrucibles();
  const lpBalance = tokenBalances?.lpBalance || BigNumber.from(0);
  const lpBalanceNumber = bigNumberishToNumber(lpBalance);
  const step = getStep(lpBalanceNumber);

  const handleIncreaseSubscription = () => {
    const signer = provider?.getSigner();
    invokeContract<IncreaseStakeParams>(
      signer,
      crucible.id,
      isMax ? lpBalance : amountBigNumber
    );
  };

  const onChange = (amountNew: number | string) => {
    onNumberInputChange(
      amountNew,
      amount,
      lpBalance,
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
          <ModalHeader>Increase LP subscription</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Increase your subscription in the Aludel Rewards program by
              depositing Uniswap Liquidity Pool tokens in your Crucible. You can
              get LP tokens by staking ETH and MIST to the{' '}
              <Link color='blue.400' isExternal href={config.uniswapPoolUrl}>
                Uniswap trading pool
              </Link>
              .
            </Text>
            <Flex
              mb={2}
              justifyContent='space-between'
              alignItems='center'
              color='gray.100'
            >
              <Text>Select amount</Text>
              <Text>
                Balance: <strong>{formatNumber.token(lpBalance)} LP</strong>
              </Text>
            </Flex>
            <NumberInput
              value={isMax ? lpBalanceNumber.toString() : amount}
              onChange={onChange}
              step={step}
              min={0}
              max={lpBalanceNumber}
              clampValueOnBlur={true}
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
              onClick={handleIncreaseSubscription}
              disabled={
                (!isMax || lpBalance.lte(0)) &&
                (amountBigNumber.lte(0) || amountBigNumber.gt(lpBalance))
              }
            >
              Increase subscription
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {ui}
    </>
  );
};

export default IncreaseStakeModal;
