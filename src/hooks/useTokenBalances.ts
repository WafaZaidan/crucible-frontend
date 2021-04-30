import { useMemo } from 'react';
import numbro from 'numbro';
import { useWeb3 } from '../context/web3';
import { config } from '../config/variables';

const useTokenBalances = () => {
  const { tokens, ethBalance } = useWeb3();
  const { lpTokenAddress, mistTokenAddress } = config;

  const lpBalanceRaw = useMemo(
    () =>
      tokens[lpTokenAddress] ? Number(tokens[lpTokenAddress]?.balance) : 0,
    [tokens]
  );

  const mistBalanceRaw = useMemo(
    () =>
      tokens[mistTokenAddress] ? Number(tokens[mistTokenAddress]?.balance) : 0,
    [tokens]
  );

  const ethBalanceRaw = ethBalance;

  const lpBalanceDisplay = numbro(lpBalanceRaw || 0).format({
    thousandSeparated: true,
    mantissa: 4,
  });

  const mistBalanceDisplay = numbro(mistBalanceRaw || 0).format({
    thousandSeparated: true,
    mantissa: 4,
  });
  const ethBalanceDisplay = numbro(ethBalanceRaw || 0).format({
    thousandSeparated: true,
    mantissa: 4,
  });

  return {
    lpBalanceRaw,
    lpBalanceDisplay,
    mistBalanceRaw,
    mistBalanceDisplay,
    ethBalanceRaw,
    ethBalanceDisplay,
  };
};

export default useTokenBalances;
