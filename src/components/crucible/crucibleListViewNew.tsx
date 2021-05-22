import React, { FC } from 'react';
import { Box, Stack, VStack } from '@chakra-ui/layout';
import { useEffect } from 'react';
import { useCrucibles } from '../../store/crucibles';
import { Skeleton } from '@chakra-ui/skeleton';
import { LightMode } from '@chakra-ui/color-mode';
import CrucibleCardNew from './crucibleCardNew';
import MissingCrucibles from './missingCrucibles';
import { useWeb3React } from '@web3-react/core';

const CruciblesListViewNew: FC = () => {
  const { crucibles, cruciblesLoading, getOwnedCrucibles } = useCrucibles();
  const { account, chainId } = useWeb3React();

  useEffect(() => {
    getOwnedCrucibles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  if (cruciblesLoading) {
    return (
      <Box p={4} bg='white' borderRadius='xl'>
        <LightMode>
          <Stack borderRadius='xl'>
            <Skeleton height='17px' />
            <Skeleton height='17px' />
          </Stack>
        </LightMode>
      </Box>
    );
  }

  if (crucibles.length === 0 && !cruciblesLoading) {
    return <MissingCrucibles />;
  }

  return (
    <VStack align='stretch' spacing={4}>
      {crucibles.map((crucible) => {
        return <CrucibleCardNew key={crucible.id} crucible={crucible} />;
      })}
    </VStack>
  );
};

export default CruciblesListViewNew;
