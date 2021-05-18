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
  2. Concat user 'imported' assets with curated
  3. Add _getCompatibleAssets thunk
  4. Add _addCustomAsset thunk
*/

import { store } from './store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOwnedCruciblesNew } from '../contracts/getOwnedCrucibles';
import { Erc20Detailed } from '../interfaces/Erc20Detailed';
import { useAppDispatch, useAppSelector } from './hooks';
import { filterAsync, mapAsync } from '../utils/async';
import { THUNK_PREFIX, SLICE_NAME } from './enum';
import { Web3Provider } from '@ethersproject/providers';
import { castDraft } from 'immer';
import { Signer } from 'ethers';

interface Crucible {
  id: string;
  owner: string;
  mintTimestamp: number;
  containedAssets: Erc20Detailed[];
}

interface CruciblesState {
  crucibles: Crucible[];
  curatedAssets: Erc20Detailed[];
  compatibleAssets: Erc20Detailed[];

  cruciblesLoading: boolean;
  compatibleAssetsLoading: boolean;
}

const initialState: CruciblesState = {
  crucibles: [],
  curatedAssets: [],
  compatibleAssets: [],

  cruciblesLoading: false,
  compatibleAssetsLoading: false,
};

const _getOwnedCrucibles = createAsyncThunk(
  THUNK_PREFIX.GET_OWNED_CRUCIBLED,
  async ({ signer, library }: { signer: Signer; library: Web3Provider }) => {
    const { crucibleFactoryAddress } = store.getState().config.selectedConfig;
    const { curatedAssets } = store.getState().crucibles;

    const crucibles = await getOwnedCruciblesNew(
      crucibleFactoryAddress,
      signer,
      library
    );

    const cruciblesWithContainedAssets = await mapAsync(
      crucibles,
      async (crucible) => {
        const curatedAssetsWithBalance = await filterAsync(
          curatedAssets,
          async (asset) => (await asset.balanceOf(crucible.id)).gte(0)
        );

        return {
          ...crucible,
          containedAssets: castDraft(curatedAssetsWithBalance),
        };
      }
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

  return { cruciblesLoading, crucibles, resetCrucibles, getOwnedCrucibles };
};

export default cruciblesSlice.reducer;
