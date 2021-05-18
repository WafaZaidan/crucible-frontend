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
    crucibleFactoryAddress: '0x54e0395CFB4f39beF66DBCd5bD93Cca4E9273D56',
  },
  4: {
    crucibleFactoryAddress: '0xf92D86483438BDe1d68e501ce15470155DeE08B3',
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
