// TEST PAGE
import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useCrucibles } from '../../../store/crucibles';
import { Box, VStack } from '@chakra-ui/layout';
import { StatGroup } from '@chakra-ui/stat';
import { Button } from '@chakra-ui/button';
import StatCard from '../../shared/StatCard';

const Assets = () => {
  const { library } = useWeb3React();
  const {
    crucibles,
    cruciblesLoading,
    getOwnedCrucibles,
    resetCrucibles,
  } = useCrucibles();

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
    </Box>
  );
};

export default Assets;
