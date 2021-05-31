import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from './hooks';

export type RewardProgramName = 'Aludel' | 'Mainnet Test' | 'Rinkeby Test';

interface RewardProgram {
  name: RewardProgramName;
  shortName: string;
  address: string;
  inflationStartTimestamp: number;
  inflationRate: number;
  initialSupply: number;
}

interface RewardProgramsState {
  rewardPrograms: { [key: number]: RewardProgram[] };
  currentRewardProgram: RewardProgram | null;
}

const initialState: RewardProgramsState = {
  rewardPrograms: {
    1: [
      {
        name: 'Aludel',
        shortName: 'ALDL',
        address: '0xf0D415189949d913264A454F57f4279ad66cB24d',
        inflationStartTimestamp: 1612661126000,
        inflationRate: 1.01,
        initialSupply: 1000000,
      },
      {
        name: 'Mainnet Test',
        shortName: 'MTST',
        address: '0xf0D415189949d913264A454F57f4279ad66cB24d',
        inflationStartTimestamp: 1612661126000,
        inflationRate: 1.01,
        initialSupply: 1000000,
      },
    ],
    4: [
      {
        name: 'Aludel',
        shortName: 'ALDL',
        address: '0xE2dD7930d8cA478d9aA38Ae0F5483B8A3B331C40',
        inflationStartTimestamp: 1612661126000,
        inflationRate: 1.01,
        initialSupply: 1000000,
      },
      {
        name: 'Rinkeby Test',
        shortName: 'RTST',
        address: '0xE2dD7930d8cA478d9aA38Ae0F5483B8A3B331C40',
        inflationStartTimestamp: 1612661126000,
        inflationRate: 1.01,
        initialSupply: 1000000,
      },
    ],
  },
  currentRewardProgram: null,
};

export const rewardProgramsSlice = createSlice({
  name: 'rewardPrograms',
  initialState,
  reducers: {
    setCurrentRewardProgram: (
      state,
      action: PayloadAction<{ chainId: number; name: RewardProgramName }>
    ) => {
      const { chainId, name } = action.payload;
      const rewardProgramsOnNetwork = state.rewardPrograms[chainId];
      const selectedRewardProgram =
        rewardProgramsOnNetwork.find((p) => p.name === name) ||
        rewardProgramsOnNetwork[0];
      state.currentRewardProgram = selectedRewardProgram;
    },
  },
});

export const useRewardPrograms = () => {
  const dispatch = useAppDispatch();
  const rewardPrograms = useAppSelector(
    (state) => state.rewardPrograms.rewardPrograms
  );
  const currentRewardProgram = useAppSelector(
    (state) => state.rewardPrograms.currentRewardProgram
  );
  const setCurrentRewardProgram = (chainId: number, name: RewardProgramName) =>
    dispatch(
      rewardProgramsSlice.actions.setCurrentRewardProgram({ chainId, name })
    );
  return { rewardPrograms, currentRewardProgram, setCurrentRewardProgram };
};

export default rewardProgramsSlice.reducer;
