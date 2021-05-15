import { ethers, Signer } from 'ethers';
import { _abi } from '../interfaces/Erc20DetailedFactory';
import { ChainId, Fetcher, Token, WETH } from '@uniswap/sdk';
import { parseUnits } from 'ethers/lib/utils';
import getMultiplier from '../utils/getMultiplier';

async function getTokenBalances(
  lpTokenAddress: string,
  mistTokenAddress: string,
  wethAddress: string,
  daiAddress: string,
  signer: Signer,
  walletAddress: string,
  chainId: ChainId
) {
  const MIST = new Token(chainId, mistTokenAddress, 18, '⚗', 'Alchemist');
  const DAI = new Token(chainId, daiAddress, 18);

  const contractMist = new ethers.Contract(mistTokenAddress, _abi, signer);
  const contractWeth = new ethers.Contract(wethAddress, _abi, signer);
  const contractLpToken = new ethers.Contract(lpTokenAddress, _abi, signer);

  const [
    mistBalance,
    lpBalance,
    lpMistBalance,
    lpWethBalance,
    totalLpSupply,
    wethPriceString,
    mistPriceInWethString,
  ] = await Promise.all([
    contractMist.balanceOf(walletAddress),
    contractLpToken.balanceOf(walletAddress),
    contractMist.balanceOf(lpTokenAddress),
    contractWeth.balanceOf(lpTokenAddress),
    contractLpToken.totalSupply(),
    (
      await Fetcher.fetchPairData(DAI, WETH[DAI.chainId])
    ).token1Price.toSignificant(),
    (
      await Fetcher.fetchPairData(MIST, WETH[DAI.chainId])
    ).token1Price.toSignificant(),
  ]);
  const wethPrice = parseUnits(wethPriceString);
  const mistPrice = wethPrice
    .mul(getMultiplier())
    .div(parseUnits(mistPriceInWethString));
  return {
    mistBalance,
    lpBalance,
    lpMistBalance,
    lpWethBalance,
    totalLpSupply,
    wethPrice,
    mistPrice,
  };
}

export default getTokenBalances;
