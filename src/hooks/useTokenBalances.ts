import { useWeb3 } from '../context/web3';
import { config } from '../config/variables';
import { BigNumber } from 'ethers';

const useTokenBalances = () => {
  const { tokens, ethBalance } = useWeb3();
  const { lpTokenAddress, mistTokenAddress } = config;

  return {
    lpBalance: tokens[lpTokenAddress]?.balance || BigNumber.from(0),
    mistBalance: tokens[mistTokenAddress]?.balance || BigNumber.from(0),
    ethBalance,
  };
};

export default useTokenBalances;
