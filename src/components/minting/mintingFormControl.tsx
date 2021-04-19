import { useState } from 'react';
import { providers } from 'ethers';
import { Button } from '@chakra-ui/button';
import { LightMode } from '@chakra-ui/color-mode';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Signer } from '@ethersproject/abstract-signer';
import { NumberInput, NumberInputField } from '@chakra-ui/number-input';
import { useContract } from '../../hooks/useContract';
import { mintAndLock } from '../../contracts/alchemist';
import { config } from '../../config/variables';
import { useWeb3 } from '../../context/web3';
import {
  Slider,
  SliderThumb,
  SliderTrack,
  SliderFilledTrack,
} from '@chakra-ui/slider';

type MintAndLockParams = Parameters<
  (signer: Signer, provider: providers.Web3Provider, lpBalance: string) => void
>;

const MintingFormControl = () => {
  const [value, setValue] = useState('0');
  const { provider } = useWeb3();
  const { invokeContract, ui } = useContract(mintAndLock);

  const handleChange = (value: number) => setValue(value.toString());

  const handleNumberInputChange = (valueAsString: string) => {
    if (isNaN(+valueAsString)) return;
    setValue(valueAsString);
  };

  const handleMintCrucible = () => {
    const lpBalance = value.toString();
    const signer = provider?.getSigner() as Signer;
    invokeContract<MintAndLockParams>(
      signer,
      provider as providers.Web3Provider,
      lpBalance
    );
  };

  const { tokens } = useWeb3();
  const { lpTokenAddress } = config;

  const isDisabled = () => {
    return (
      !value ||
      value === '0' ||
      Number(value) > Number(tokens[lpTokenAddress].balance)
    );
  };

  return (
    <Box>
      <LightMode>
        <Box bg='white' p={4} mb={4} borderRadius='xl' color='gray.800'>
          <Flex mb={4} justifyContent='space-between' alignItems='center'>
            <Text>Select amount</Text>
            <Text>
              Balance:{' '}
              <strong>{tokens[lpTokenAddress].balance.toFixed(3)} LP</strong>
            </Text>
          </Flex>
          <Box>
            <NumberInput
              mb={4}
              size='lg'
              bg='gray.50'
              value={value}
              onChange={handleNumberInputChange}
              borderRadius='xl'
            >
              <NumberInputField
                fontSize='xl'
                fontWeight='bold'
                _hover={{
                  borderColor: 'gray.600',
                }}
                _focus={{
                  borderColor: 'gray.600',
                  borderWidth: '2px',
                }}
              />
            </NumberInput>
            <Box mb={4}>
              <Slider
                step={0.1}
                min={0}
                max={Number(tokens[lpTokenAddress].balance.toFixed(3))}
                value={Number(value)}
                onChange={handleChange}
                focusThumbOnChange={false}
              >
                <SliderTrack>
                  <SliderFilledTrack bg='gray.600' />
                </SliderTrack>
                <SliderThumb fontSize='sm' boxSize='18px' bg='yellow.400' />
              </Slider>
            </Box>
          </Box>
        </Box>
      </LightMode>
      <Button
        size='lg'
        isFullWidth
        disabled={isDisabled()}
        onClick={handleMintCrucible}
      >
        Mint a crucible
      </Button>
      {ui}
    </Box>
  );
};

export default MintingFormControl;
