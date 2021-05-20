/*
  Limitation:
  The Crucible smart contract does not have a function to get a list of assets stored within the Crucible

  Workaround:
  1. Use etherscan API to get list of ERC-20 transactions
  2. Check the final balance for each ERC-20 token after all transactions (last 10,000)

  TODO:
  1. Standardize error handling
*/

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOwnedCruciblesNew } from '../contracts/getOwnedCrucibles';
import { useAppDispatch, useAppSelector } from './hooks';
import { THUNK_PREFIX, SLICE_NAME } from './enum';
import { Web3Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContainedAssets } from '../helpers/crucible';
import { useWeb3React } from '@web3-react/core';

interface ContainedAsset {
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
}

interface Crucible {
  id: string;
  owner: string;
  mintTimestamp: number;
  containedAssets: ContainedAsset[];
}

interface CruciblesState {
  crucibles: Crucible[];
  cruciblesLoading: boolean;
}

interface GetOwnedCruciblesArgs {
  signer: Signer;
  library: Web3Provider;
  crucibleFactoryAddress: string;
  chainId: number;
  etherscanApiKey: string;
}

const initialState: CruciblesState = {
  crucibles: [],
  cruciblesLoading: false,
};

export const _getOwnedCrucibles = createAsyncThunk(
  THUNK_PREFIX.GET_OWNED_CRUCIBLED,
  async ({
    signer,
    library,
    crucibleFactoryAddress,
    chainId,
    etherscanApiKey,
  }: GetOwnedCruciblesArgs) => {
    const crucibles = await getOwnedCruciblesNew(
      crucibleFactoryAddress,
      signer,
      library
    );

    const containedAssetsList: ContainedAsset[][] = await Promise.all(
      crucibles.map((crucible) =>
        getContainedAssets(crucible.id, chainId, etherscanApiKey)
      )
    );

    const cruciblesWithContainedAssets: Crucible[] = crucibles.map(
      (crucible, idx) => ({
        ...crucible,
        containedAssets: containedAssetsList[idx],
      })
    );

    return cruciblesWithContainedAssets;
  }
);

export const cruciblesSlice = createSlice({
  name: SLICE_NAME.CRUCIBLES,
  initialState,
  reducers: {
    resetCrucibles: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(_getOwnedCrucibles.pending, (state) => {
        state.cruciblesLoading = true;
      })
      .addCase(_getOwnedCrucibles.fulfilled, (state, action) => {
        state.cruciblesLoading = false;
        state.crucibles = action.payload;
      })
      .addCase(_getOwnedCrucibles.rejected, (state, action) => {
        state.cruciblesLoading = false;
        state.crucibles = [];
      });
  },
});

export const useCrucibles = () => {
  const dispatch = useAppDispatch();

  const { chainId = 1 } = useWeb3React();

  const { crucibleFactoryAddress, etherscanApiKey } = useAppSelector(
    (state) => state.config.config[chainId]
  );

  const cruciblesLoading = useAppSelector(
    (state) => state.crucibles.cruciblesLoading
  );

  const crucibles = useAppSelector((state) => state.crucibles.crucibles);

  const resetCrucibles = () =>
    dispatch(cruciblesSlice.actions.resetCrucibles());

  const getOwnedCrucibles = (signer: Signer, library: Web3Provider) =>
    dispatch(
      _getOwnedCrucibles({
        signer,
        library,
        crucibleFactoryAddress,
        chainId,
        etherscanApiKey,
      })
    );

  return {
    crucibles,
    resetCrucibles,
    getOwnedCrucibles,
    cruciblesLoading,
  };
};

export default cruciblesSlice.reducer;
