// TEST PAGE
import React, { useEffect } from 'react';
import { useCrucibles } from '../../../store/crucibles';
import { Box, VStack } from '@chakra-ui/layout';
import { StatGroup } from '@chakra-ui/stat';
import { Button } from '@chakra-ui/button';
import StatCard from '../../shared/StatCard';

const Assets = () => {
  const {
    crucibles,
    cruciblesLoading,
    getOwnedCrucibles,
    resetCrucibles,
  } = useCrucibles();

  useEffect(() => {
    getOwnedCrucibles();
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
        <Button onClick={() => getOwnedCrucibles()}>Refresh crucibles</Button>
      </VStack>
    </Box>
  );
};

export default Assets;
