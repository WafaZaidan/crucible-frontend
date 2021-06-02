import React, { useEffect, useMemo } from 'react';
import { Crucible, useCrucibles } from '../../../store/crucibles';
import { Box, Stack } from '@chakra-ui/layout';
import { Redirect, useParams } from 'react-router';
import { useWeb3React } from '@web3-react/core';
import TransferErc20 from './assets-detail/transferErc20';
import AssetsLoadingSkeleton from './assets-detail/assetsLoadingSkeleton';

const Assets = () => {
  const { account } = useWeb3React();
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
    return <AssetsLoadingSkeleton />;
  }

  if (crucibles.length === 0) {
    return <Redirect to='/' />;
  }

  return (
    <Box>
      <Stack spacing={4}>
        <TransferErc20
          crucible={selectedCrucible}
          walletAddress={account}
          type='withdraw'
        />
        <TransferErc20
          crucible={selectedCrucible}
          walletAddress={account}
          type='deposit'
        />
      </Stack>
    </Box>
  );
};

export default Assets;
