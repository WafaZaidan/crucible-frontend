import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from './hooks';

export type Flag = 'enableMultipleRewardPrograms';

interface FeatureFlag {
  features: {
    [Item in Flag]: boolean;
  };
}

const initialState: FeatureFlag = {
  features: {
    enableMultipleRewardPrograms: false,
  },
};

export const featureFlagSlice = createSlice({
  name: 'featureFlag',
  initialState,
  reducers: {
    toggleFlag: (state, action: PayloadAction<Flag>) => {
      state.features[action.payload] = !state.features[action.payload];
    },
  },
});

export const useFeatureFlag = () => {
  const dispatch = useAppDispatch();
  const featureFlag = useAppSelector((state) => state.featureFlag.features);
  const toggleFlag = (flag: Flag) =>
    dispatch(featureFlagSlice.actions.toggleFlag(flag));
  return { featureFlag, toggleFlag };
};

export default featureFlagSlice.reducer;
