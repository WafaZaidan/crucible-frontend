import React, { useEffect, useMemo } from 'react';
import { Crucible, useCrucibles } from '../../../store/crucibles';
import { Box, Stack } from '@chakra-ui/layout';
import { useParams } from 'react-router';
import WithdrawCrucibleAssets from './assets-detail/withdrawCrucibleAssets';

const Assets = () => {
  const { crucibleId } = useParams<{ crucibleId: string }>();
  const { crucibles, cruciblesLoading, getOwnedCrucibles } = useCrucibles();

  useEffect(() => {
    getOwnedCrucibles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedCrucible = useMemo(() => {
    return crucibles.find(({ id }) => id === crucibleId) as Crucible;
  }, [crucibles, crucibleId]);

  if (cruciblesLoading) {
    return <div>Loading...</div>;
  }

  if (crucibles.length === 0) {
    // TODO: Send the user back to the list view
    return <div>No crucibles</div>;
  }

  return (
    <Box>
      <Stack spacing={4}>
        <WithdrawCrucibleAssets crucible={selectedCrucible} />
      </Stack>
    </Box>
  );
};

export default Assets;
