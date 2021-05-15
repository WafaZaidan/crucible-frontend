import { ChainId, Pair, Token, TokenAmount } from '@uniswap/sdk';
import { BigNumber } from 'ethers';
import numberishToBigNumber from '../utils/numberishToBigNumber';

const getUniswapBalances = (
  lpTokenAddress: string,
  mistTokenAddress: string,
  wethAddress: string,
  lpBalance: BigNumber,
  lpMistBalance: BigNumber,
  lpWethBalance: BigNumber,
  totalLpSupply: BigNumber,
  wethPrice: BigNumber,
  mistPrice: BigNumber,
  chainId: ChainId
) => {
  const MIST = new Token(chainId, mistTokenAddress, 18, '⚗', 'Alchemist');
  const WETH = new Token(chainId, wethAddress, 18, 'WETH', 'Wrapped Ether');
  const LP = new Token(chainId, lpTokenAddress, 18, 'UNI-V2', 'UniswapV2Pair');
  const pair = new Pair(
    new TokenAmount(MIST, lpMistBalance.toString()),
    new TokenAmount(WETH, lpWethBalance.toString())
  );

  const currentMistInLp = numberishToBigNumber(
    pair
      .getLiquidityValue(
        MIST,
        new TokenAmount(LP, totalLpSupply.toString()),
        new TokenAmount(LP, lpBalance.toString()),
        false
      )
      .toSignificant()
  );
  const currentWethInLp = numberishToBigNumber(
    pair
      .getLiquidityValue(
        WETH,
        new TokenAmount(LP, totalLpSupply.toString()),
        new TokenAmount(LP, lpBalance.toString()),
        false
      )
      .toSignificant()
  );
  return {
    currentMistInLp,
    currentWethInLp,
  };
};

export default getUniswapBalances;
