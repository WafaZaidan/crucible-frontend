import { client as apolloClient } from '../config/apollo';
import { GET_PAIR_DATA } from '../queries/uniswap';

export const tokenSymbolFromPair = async (
  pairAddress: string,
  tokenSymbol: string,
  chainId: number
) => {
  if (chainId !== 1) {
    // No Uniswap graph for Rinkeby
    return tokenSymbol;
  }
  try {
    const { data } = await apolloClient.query({
      query: GET_PAIR_DATA(pairAddress),
    });
    return data.pair.token0.symbol + ' - ' + data.pair.token1.symbol + ' LP';
  } catch (e) {
    console.log(e);
    return tokenSymbol;
  }
};
