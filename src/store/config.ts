import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from './hooks';

interface Config {
  crucibleFactoryAddress: string;
}

interface ConfigOptions {
  [key: number]: Config;
}

interface ConfigState {
  selectedConfig: Config;
}

const configOptions: ConfigOptions = {
  0: {
    crucibleFactoryAddress: '124',
  },
  4: {
    crucibleFactoryAddress: '124',
  },
};

const initialState: ConfigState = {
  selectedConfig: configOptions[0],
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    changeConfig: (state, action) => {
      state.selectedConfig = configOptions[action.payload.network];
    },
  },
});

export const useConfig = () => {
  const dispatch = useAppDispatch();

  const config = useAppSelector((state) => state.config.selectedConfig);

  const changeConfig = (network: number) =>
    dispatch(configSlice.actions.changeConfig({ network }));

  return { config, changeConfig };
};

export default configSlice.reducer;
