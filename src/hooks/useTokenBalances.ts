import { useTokens } from '../context/tokens';
import { config } from '../config/variables';
import { BigNumber } from 'ethers';

const useTokenBalances = () => {
  const { tokens, ethBalance } = useTokens();
  const { lpTokenAddress, mistTokenAddress } = config;

  return {
    lpBalance: tokens[lpTokenAddress]?.balance || BigNumber.from(0),
    mistBalance: tokens[mistTokenAddress]?.balance || BigNumber.from(0),
    ethBalance,
  };
};

export default useTokenBalances;
