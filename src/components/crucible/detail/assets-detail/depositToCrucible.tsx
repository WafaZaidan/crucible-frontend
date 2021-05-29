import { Button } from '@chakra-ui/button';
import { InputRightElement } from '@chakra-ui/input';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { NumberInput, NumberInputField } from '@chakra-ui/number-input';
import { Select } from '@chakra-ui/react';
import { useState } from 'react';
import { useContract } from '../../../../hooks/useContract';
import { useWeb3React } from '@web3-react/core';
import { Signer } from '@ethersproject/abstract-signer';
import { BigNumber } from '@ethersproject/bignumber';
import { useContainedAssets } from '../../../../hooks/useContainedAssets';
import useContracts from '../../../../contracts/useContracts';
import getStep from '../../../../utils/getStep';
import bigNumberishToNumber from '../../../../utils/bigNumberishToNumber';
import formatNumber from '../../../../utils/formatNumber';
import onNumberInputChange from '../../../../utils/onNumberInputChange';
import numberishToBigNumber from '../../../../utils/numberishToBigNumber';
import { Crucible } from '../../../../store/crucibles';

type Props = {
  crucible: Crucible;
  walletAddress: string | null | undefined;
};

type depositToCrucibleParams = Parameters<
  (
    signer: Signer,
    crucibleAddress: string,
    tokenAddress: string,
    amount: BigNumber
  ) => void
>;

const DepositToCrucible: React.FC<Props> = ({ crucible, walletAddress }) => {
  const {
    containedAssetsLoading,
    error,
    containedAssets,
    selectedAsset,
    handleSetSelectedAsset,
  } = useContainedAssets({ address: walletAddress as string });
  const { depositToCrucible } = useContracts();
  const { library } = useWeb3React();
  const { invokeContract, ui } = useContract(depositToCrucible);
  const [isMax, setIsMax] = useState(false);
  const [amount, setAmount] = useState('0');

  if (error) {
    return <Text>{error}</Text>;
  }
  // TODO: Add loading skeleton
  if (containedAssetsLoading) {
    return <Box>Loading...</Box>;
  }
  if (containedAssets.length === 0) {
    return <Text>This crucible has no assets that can be withdrawn</Text>;
  }
  if (!selectedAsset) {
    return null;
  }

  const tokenBalance = selectedAsset.value;
  const tokenBalanceNumber = bigNumberishToNumber(tokenBalance);
  const amountBigNumber = numberishToBigNumber(amount || 0);
  const step = getStep(tokenBalanceNumber);

  const onChange = (amountNew: number | string) => {
    onNumberInputChange(
      amountNew,
      amount,
      tokenBalance,
      isMax,
      setAmount,
      setIsMax
    );
  };

  const handleWithdrawFromCrucible = () => {
    const signer = library?.getSigner() as Signer;

    invokeContract<depositToCrucibleParams>(
      signer,
      crucible.id,
      selectedAsset.contractAddress,
      isMax && tokenBalance ? tokenBalance : amountBigNumber
    );
  };

  return (
    <Box p={[6]} bg='white' color='gray.800' borderRadius='xl'>
      <Flex alignItems='center' justifyContent='space-between' mb={2}>
        <Text>Select amount to deposit</Text>
        <Text>
          Balance: {tokenBalance ? formatNumber.token(tokenBalanceNumber) : '-'}{' '}
          {selectedAsset.tokenSymbol}
        </Text>
      </Flex>

      <NumberInput
        mb={4}
        size='lg'
        bg='gray.50'
        step={step}
        min={0}
        max={tokenBalanceNumber}
        value={isMax ? tokenBalanceNumber.toString() : amount}
        onChange={onChange}
        borderRadius='xl'
      >
        <NumberInputField
          pr='14rem'
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
        <InputRightElement width='fit-content'>
          <Flex>
            <Button
              variant='ghost'
              onClick={() => setIsMax(true)}
              color='gray.600'
            >
              Max
            </Button>
            <Select onChange={(e) => handleSetSelectedAsset(e.target.value)}>
              {containedAssets.map((asset) => (
                <option
                  key={asset.contractAddress}
                  value={asset.contractAddress}
                >
                  {asset.tokenSymbol}
                </option>
              ))}
            </Select>
          </Flex>
        </InputRightElement>
      </NumberInput>
      <Button
        isFullWidth
        onClick={handleWithdrawFromCrucible}
        disabled={
          (!isMax || tokenBalance.lte(0)) &&
          (amountBigNumber.lte(0) || amountBigNumber.gt(tokenBalance))
        }
      >
        Deposit to crucible
      </Button>
      {ui}
    </Box>
  );
};

export default DepositToCrucible;
