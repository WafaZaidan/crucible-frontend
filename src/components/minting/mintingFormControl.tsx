import React, { FC, useMemo, useState } from 'react';
import { providers } from 'ethers';
import { Button } from '@chakra-ui/button';
import { LightMode } from '@chakra-ui/color-mode';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Signer } from '@ethersproject/abstract-signer';
import { NumberInput, NumberInputField } from '@chakra-ui/number-input';
import { useContract } from '../../hooks/useContract';
import { mintAndLock } from '../../contracts/alchemist';
import { useWeb3 } from '../../context/web3';
import {
  Slider,
  SliderThumb,
  SliderTrack,
  SliderFilledTrack,
} from '@chakra-ui/slider';
import { InputRightElement } from '@chakra-ui/input';
import useTokenBalances from '../../hooks/useTokenBalances';

type MintAndLockParams = Parameters<
  (signer: Signer, provider: providers.Web3Provider, lpBalance: string) => void
>;

const MintingFormControl: FC = () => {
  const [amountLpToMint, setAmountLpToMint] = useState(0);
  const { provider } = useWeb3();
  const { invokeContract, ui } = useContract(mintAndLock);
  const { lpBalanceDisplay, lpBalanceRaw } = useTokenBalances();

  const handleChange = (amount: number | string) => {
    if (isNaN(+amount)) return;
    setAmountLpToMint(+amount);
  };

  const handleMintCrucible = () => {
    const amountToMint = amountLpToMint.toString();
    const signer = provider?.getSigner() as Signer;

    invokeContract<MintAndLockParams>(
      signer,
      provider as providers.Web3Provider,
      amountToMint
    );
  };

  const isDisabled = useMemo(
    () => !amountLpToMint || amountLpToMint > lpBalanceRaw,
    [amountLpToMint, lpBalanceRaw]
  );

  return (
    <Box>
      <LightMode>
        <Box bg='white' p={4} mb={6} borderRadius='xl' color='gray.800'>
          <Flex mb={4} justifyContent='space-between' alignItems='center'>
            <Text>Select amount</Text>
            <Text>
              Balance: <strong>{lpBalanceDisplay} LP</strong>
            </Text>
          </Flex>
          <Box>
            <NumberInput
              mb={4}
              size='lg'
              bg='gray.50'
              value={amountLpToMint}
              onChange={handleChange}
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
                <Button
                  variant='ghost'
                  // fixing to 8 decimals to account for dust
                  onClick={() => setAmountLpToMint(+lpBalanceRaw.toFixed(8))}
                >
                  Max
                </Button>
              </InputRightElement>
            </NumberInput>
            <Box mb={4} mx={4}>
              <Slider
                step={0.001}
                min={0}
                max={lpBalanceRaw}
                value={amountLpToMint}
                onChange={handleChange}
                focusThumbOnChange={false}
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
        disabled={isDisabled}
        onClick={handleMintCrucible}
      >
        Mint a crucible
      </Button>
      {ui}
    </Box>
  );
};

export default MintingFormControl;
