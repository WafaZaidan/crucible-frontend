import { ChainId, Token, TokenAmount, Pair } from '@uniswap/sdk';
import { BigNumber } from 'ethers';
import { config } from '../config/variables';

const { lpTokenAddress, mistTokenAddress, wethAddress } = config;

export const getUniswapBalances = (
  lpBalance: string,
  lpMistBalance: BigNumber,
  lpWethBalance: BigNumber,
  totalLpSupply: BigNumber,
  wethPrice: number,
  mistPrice: number,
  chainId: ChainId
) => {
  const MIST = new Token(chainId, mistTokenAddress, 18, '⚗', 'Alchemist');
  const WETH = new Token(chainId, wethAddress, 18, 'WETH', 'Wrapped Ether');
  const LP = new Token(chainId, lpTokenAddress, 18, 'UNI-V2', 'UniswapV2Pair');
  const pair = new Pair(
    new TokenAmount(MIST, lpMistBalance.toString()),
    new TokenAmount(WETH, lpWethBalance.toString())
  );

  let mistValue = pair
    .getLiquidityValue(
      MIST,
      new TokenAmount(LP, totalLpSupply.toString()),
      new TokenAmount(LP, lpBalance.toString()),
      false
    )
    .toSignificant();
  let wethValue = pair
    .getLiquidityValue(
      WETH,
      new TokenAmount(LP, totalLpSupply.toString()),
      new TokenAmount(LP, lpBalance.toString()),
      false
    )
    .toSignificant();
  return {
    mistValue: Number(mistValue),
    wethValue: Number(wethValue),
    ...(wethPrice && {
      wethValueUsd: (Number(wethValue) * wethPrice).toFixed(2),
    }),
    ...(mistPrice && {
      mistValueUsd: (Number(mistValue) * mistPrice).toFixed(2),
    }),
  };
};
