import { createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from './hooks';

interface Config extends CommonConfig {
  crucibleFactoryAddress: string;
  wethTokenAddress: string;
  mistTokenAddress: string;
  lpTokenAddress: string;
}

interface ConfigOptions {
  [key: number]: Config;
}

interface ConfigState {
  config: ConfigOptions;
}

interface CommonConfig {
  etherscanApiKey: string;
}

const commonConfig: CommonConfig = {
  etherscanApiKey: 'Y44B2NZ5TEZGIG7IAK2M4AYATEYQUX79E4',
};

const configOptions: ConfigOptions = {
  0: {
    crucibleFactoryAddress: '0x54e0395CFB4f39beF66DBCd5bD93Cca4E9273D56',
    wethTokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    mistTokenAddress: '0x88ACDd2a6425c3FaAE4Bc9650Fd7E27e0Bebb7aB',
    lpTokenAddress: '0xCD6bcca48069f8588780dFA274960F15685aEe0e',
    ...commonConfig,
  },
  4: {
    crucibleFactoryAddress: '0xf92D86483438BDe1d68e501ce15470155DeE08B3',
    wethTokenAddress: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    mistTokenAddress: '0xF6c1210Aca158bBD453A12604A03AeD2659ac0ef',
    lpTokenAddress: '0xe55687682fdf08265d1672ea0c91fa884ccd8955',
    ...commonConfig,
  },
};

const initialState: ConfigState = {
  config: configOptions,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
});

export const useConfig = () => {
  const config = useAppSelector((state) => state.config.config);
  return { config };
};

export default configSlice.reducer;
