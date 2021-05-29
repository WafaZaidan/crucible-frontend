/*
  Limitation:
  The Crucible smart contract does not have a function to get a list of assets stored within the Crucible

  Workaround:
  1. Use etherscan API to get list of ERC-20 transactions
  2. Create a list of unique tokens that the user has interacted with

  TODO:
  1. Standardize error handling
*/

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOwnedCruciblesNew } from '../contracts/getOwnedCrucibles';
import { useAppDispatch, useAppSelector } from './hooks';
import { THUNK_PREFIX, SLICE_NAME } from './enum';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Signer } from 'ethers';

export interface Crucible {
  id: string;
  owner: string;
  mintTimestamp: number;
}

interface CruciblesState {
  crucibles: Crucible[];
  cruciblesLoading: boolean;
}

interface GetOwnedCruciblesArgs {
  signer: Signer;
  library: Web3Provider;
  crucibleFactoryAddress: string;
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
  }: GetOwnedCruciblesArgs) => {
    const crucibles = await getOwnedCruciblesNew(
      crucibleFactoryAddress,
      signer,
      library
    );
    return crucibles;
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

  const { chainId = 1, library } = useWeb3React();

  const { crucibleFactoryAddress } = useAppSelector(
    (state) => state.config.config[chainId]
  );

  const cruciblesLoading = useAppSelector(
    (state) => state.crucibles.cruciblesLoading
  );

  const crucibles = useAppSelector((state) => state.crucibles.crucibles);

  const resetCrucibles = () =>
    dispatch(cruciblesSlice.actions.resetCrucibles());

  const signer = library.getSigner();

  const getOwnedCrucibles = () =>
    dispatch(
      _getOwnedCrucibles({
        signer,
        library,
        crucibleFactoryAddress,
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
