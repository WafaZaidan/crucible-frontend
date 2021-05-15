import { useTokens } from '../context/tokens';
import useConfigVariables from './useConfigVariables';
import { BigNumber } from 'ethers';

const useTokenBalances = () => {
  const { tokens, ethBalance } = useTokens();
  const { lpTokenAddress, mistTokenAddress } = useConfigVariables();

  return {
    lpBalance: tokens[lpTokenAddress]?.balance || BigNumber.from(0),
    mistBalance: tokens[mistTokenAddress]?.balance || BigNumber.from(0),
    ethBalance,
  };
};

export default useTokenBalances;
