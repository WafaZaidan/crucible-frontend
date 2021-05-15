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
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/slider';
import { Box } from '@chakra-ui/layout';
import { BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useContract } from '../../hooks/useContract';
import { Crucible } from '../../context/crucibles';
import useContracts from '../../contracts/useContracts';
import useConfigVariables from '../../hooks/useConfigVariables';
import formatNumber from '../../utils/formatNumber';
import bigNumberishToNumber from '../../utils/bigNumberishToNumber';
import numberishToBigNumber from '../../utils/numberishToBigNumber';
import getStep from '../../utils/getStep';
import onNumberInputChange from '../../utils/onNumberInputChange';
import useTokenBalances from '../../hooks/useTokenBalances';

type IncreaseStakeParams = Parameters<
  (signer: any, crucibleAddress: string, amount: BigNumber) => void
>;

type Props = {
  crucible: Crucible;
  onClose: () => void;
};

const IncreaseStakeModal: FC<Props> = ({ onClose, crucible }) => {
  const { library } = useWeb3React();
  const [isMax, setIsMax] = useState(false);
  const [amountLpToStake, setAmountLpToStake] = useState('0');
  const amountLpToStakeBN = numberishToBigNumber(amountLpToStake || 0);
  const config = useConfigVariables();
  const { increaseStake } = useContracts();

  const successCallback = (txHash: string) => {
    // Hacky
    localStorage.setItem('inFlightSubscriptionHash', txHash);
    onClose();
  };

  const { invokeContract, ui } = useContract(increaseStake, (txHash: string) =>
    successCallback(txHash)
  );

  const { lpBalance: lpBalanceBN } = useTokenBalances();
  const lpBalanceNumber = bigNumberishToNumber(lpBalanceBN);
  const step = getStep(lpBalanceNumber);

  const handleIncreaseSubscription = () => {
    const signer = library?.getSigner();
    invokeContract<IncreaseStakeParams>(
      signer,
      crucible.id,
      isMax ? lpBalanceBN : amountLpToStakeBN
    );
  };

  const onChange = (amountNew: number | string) => {
    onNumberInputChange(
      amountNew,
      amountLpToStake,
      lpBalanceBN,
      isMax,
      setAmountLpToStake,
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
                Balance: <strong>{formatNumber.token(lpBalanceBN)} LP</strong>
              </Text>
            </Flex>
            <NumberInput
              value={isMax ? lpBalanceNumber.toString() : amountLpToStake}
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
            <Box my={4} mx={4}>
              <Slider
                step={step}
                min={0}
                max={lpBalanceNumber}
                value={isMax ? lpBalanceNumber : +amountLpToStake || 0}
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
              onClick={handleIncreaseSubscription}
              disabled={
                (!isMax || lpBalanceBN.lte(0)) &&
                (amountLpToStakeBN.lte(0) || amountLpToStakeBN.gt(lpBalanceBN))
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
