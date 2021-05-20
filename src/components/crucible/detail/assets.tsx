// TEST PAGE
import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useCrucibles } from '../../../store/crucibles';
import { Box, Text, VStack } from '@chakra-ui/layout';
import { StatGroup } from '@chakra-ui/stat';
import { Button } from '@chakra-ui/button';
import StatCard from '../../shared/StatCard';
import { useTransactions } from '../../../store/transactions/reducer';
import { TxnStatus, TxnType } from '../../../store/transactions/types';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

const Assets = () => {
  const [crucibleId, setCrucibleId] = useState('');
  const [transferTo, setTransferTo] = useState('');

  const { library } = useWeb3React();
  const {
    crucibles,
    cruciblesLoading,
    getOwnedCrucibles,
    resetCrucibles,
  } = useCrucibles();

  const { transactions, transferCrucible } = useTransactions();
  const transferStatus = transactions[TxnType.transfer]?.status;

  useEffect(() => {
    getOwnedCrucibles(library.getSigner(), library);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (cruciblesLoading) {
    return <div>Loading...</div>;
  }

  if (crucibles.length === 0) {
    return <div>No crucibles</div>;
  }

  return (
    <Box p={[4, 8]} bg='white' color='gray.800' borderRadius='xl'>
      <StatGroup>
        {crucibles.map((crucible) => (
          <StatCard
            key={crucible.id}
            title={crucible.id}
            label={JSON.stringify(crucible.containedAssets)}
          />
        ))}
      </StatGroup>

      <VStack>
        <Button onClick={() => resetCrucibles()}>Reset crucibles</Button>
        <Button onClick={() => getOwnedCrucibles(library.getSigner(), library)}>
          Refresh crucibles
        </Button>
      </VStack>
      <VStack bgColor='#c9a5ed' p={5}>
        <FormControl>
          <FormLabel htmlFor='crucibleId'>Crucible ID to transfer</FormLabel>
          <Input
            variant='outline'
            id='crucibleId'
            placeholder='crucibleId'
            onChange={(e) => setCrucibleId(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor='recipientAddress'>recipient address</FormLabel>
          <Input
            variant='outline'
            id='recipientAddress'
            placeholder='recipientAddress'
            onChange={(e) => setTransferTo(e.target.value)}
          />
        </FormControl>
        <Text>TRANSFER STATUS: {transferStatus}</Text>
        <Button
          onClick={() => transferCrucible(crucibleId, transferTo)}
          disabled={transferStatus !== TxnStatus.Ready}
        >
          Transfer crucible
        </Button>
      </VStack>
    </Box>
  );
};

export default Assets;
