/*
  Limitation:
  The Crucible smart contract does not have a function to get a list of assets stored within the Crucible

  Workaround:
  1. Hardcode a curated list of assets (e.g. MIST, ETH, MIST-ETH-LP)
  2. For each crucible, check the balance of each asset from the curated list
  3. If there is a balance, add it to the containedAssetsList
  4. Allow users to 'import' more assets via an asset selection modal
  5. The assets in the asset selection modal will come from a BE endpoint
  6. Check that the user selected asset(s) have a balance and add it to the containedAssetsList if true

  TODO:
  1. Wrap thunk to handle errors and show toasts
*/

import { store } from './store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOwnedCruciblesNew } from '../contracts/getOwnedCrucibles';
import { useAppDispatch, useAppSelector } from './hooks';
import { THUNK_PREFIX, SLICE_NAME } from './enum';
import { Web3Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContainedAssets } from '../helpers/crucible';

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

const initialState: CruciblesState = {
  crucibles: [],
  cruciblesLoading: false,
};

const _getOwnedCrucibles = createAsyncThunk(
  THUNK_PREFIX.GET_OWNED_CRUCIBLED,
  async ({ signer, library }: { signer: Signer; library: Web3Provider }) => {
    const { crucibleFactoryAddress } = store.getState().config.selectedConfig;

    const crucibles = await getOwnedCruciblesNew(
      crucibleFactoryAddress,
      signer,
      library
    );

    const containedAssetsList: ContainedAsset[][] = await Promise.all(
      crucibles.map((crucible) => getContainedAssets(crucible.id))
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
      .addCase(_getOwnedCrucibles.rejected, (state) => {
        state.cruciblesLoading = false;
        state.crucibles = [];
      });
  },
});

export const useCrucibles = () => {
  const dispatch = useAppDispatch();

  const cruciblesLoading = useAppSelector(
    (state) => state.crucibles.cruciblesLoading
  );
  const crucibles = useAppSelector((state) => state.crucibles.crucibles);

  const resetCrucibles = () =>
    dispatch(cruciblesSlice.actions.resetCrucibles());

  const getOwnedCrucibles = (signer: Signer, library: Web3Provider) =>
    dispatch(_getOwnedCrucibles({ signer, library }));

  return {
    crucibles,
    resetCrucibles,
    getOwnedCrucibles,
    cruciblesLoading,
  };
};

export default cruciblesSlice.reducer;
