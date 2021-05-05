import { useWeb3 } from '../context/web3';
import { config } from '../config/variables';

const useTokenBalances = () => {
  const { tokens, ethBalance } = useWeb3();
  const { lpTokenAddress, mistTokenAddress } = config;

  return {
    lpBalance: tokens[lpTokenAddress]?.balance,
    mistBalance: tokens[mistTokenAddress]?.balance,
    ethBalance,
  };
};

export default useTokenBalances;
