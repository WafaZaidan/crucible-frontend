import { FC, useState } from 'react';
import { BigNumber, providers } from 'ethers';
import { Button } from '@chakra-ui/button';
import { LightMode } from '@chakra-ui/color-mode';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Signer } from '@ethersproject/abstract-signer';
import { NumberInput, NumberInputField } from '@chakra-ui/number-input';
import { useContract } from '../../hooks/useContract';
import useContracts from '../../contracts/useContracts';
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/slider';
import { InputRightElement } from '@chakra-ui/input';
import useTokenBalances from '../../hooks/useTokenBalances';
import numberishToBigNumber from '../../utils/numberishToBigNumber';
import formatNumber from '../../utils/formatNumber';
import bigNumberishToNumber from '../../utils/bigNumberishToNumber';
import getStep from '../../utils/getStep';
import onNumberInputChange from '../../utils/onNumberInputChange';
import { useWeb3React } from '@web3-react/core';

type MintAndLockParams = Parameters<
  (signer: Signer, provider: providers.Web3Provider, amount: BigNumber) => void
>;

const MintingFormControl: FC = () => {
  const [isMax, setIsMax] = useState(false);
  const [amount, setAmount] = useState('0');
  const amountBigNumber = numberishToBigNumber(amount || 0);
  const { library } = useWeb3React();
  const { mintAndLock } = useContracts();
  const { invokeContract, ui } = useContract(mintAndLock);
  const { lpBalance } = useTokenBalances();
  let lpBalanceNumber = 0;
  let step = 1;
  if (lpBalance) {
    lpBalanceNumber = bigNumberishToNumber(lpBalance);
    step = getStep(lpBalanceNumber);
  }

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

  const handleMintCrucible = () => {
    const signer = library?.getSigner() as Signer;

    invokeContract<MintAndLockParams>(
      signer,
      library as providers.Web3Provider,
      isMax && lpBalance ? lpBalance : amountBigNumber
    );
  };

  return (
    <Box>
      <LightMode>
        <Box bg='white' p={4} mb={6} borderRadius='xl' color='gray.800'>
          <Flex mb={4} justifyContent='space-between' alignItems='center'>
            <Text>Select amount</Text>
            <Text>
              Balance:{' '}
              <strong>
                {lpBalance ? formatNumber.token(lpBalance) : '-'} LP
              </strong>
            </Text>
          </Flex>
          <Box>
            <NumberInput
              mb={4}
              size='lg'
              bg='gray.50'
              step={step}
              min={0}
              max={lpBalanceNumber}
              value={isMax ? lpBalanceNumber.toString() : amount}
              onChange={onChange}
              borderRadius='xl'
            >
              <NumberInputField
                pr='4.5rem'
                fontSize='xl'
                fontWeight='bold'
                borderRadius='xl'
                _hover={{
                  borderColor: 'gray.600',
                }}
                _focus={{
                  borderColor: 'gray.600',
                  borderWidth: '2px',
                }}
              />
              <InputRightElement width='4.5rem'>
                <Button variant='ghost' onClick={() => setIsMax(true)}>
                  Max
                </Button>
              </InputRightElement>
            </NumberInput>
            <Box mb={4} mx={4}>
              <Slider
                step={step}
                min={0}
                max={lpBalanceNumber}
                value={isMax ? lpBalanceNumber : parseFloat(amount)}
                onChange={onChange}
              >
                <SliderTrack>
                  <SliderFilledTrack bg='purple.500' />
                </SliderTrack>
                <SliderThumb fontSize='sm' boxSize='18px' bg='purple.500' />
              </Slider>
            </Box>
          </Box>
        </Box>
      </LightMode>
      <Button
        size='lg'
        isFullWidth
        disabled={
          !lpBalance ||
          ((!isMax || lpBalance.lte(0)) &&
            (amountBigNumber.lte(0) || amountBigNumber.gt(lpBalance)))
        }
        onClick={handleMintCrucible}
      >
        Mint a Crucible
      </Button>
      {ui}
    </Box>
  );
};

export default MintingFormControl;
