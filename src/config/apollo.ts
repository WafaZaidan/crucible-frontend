import { config } from './variables';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const { uniswapSubgraphUrl } = config;

export const client = new ApolloClient({
  uri: uniswapSubgraphUrl,
  cache: new InMemoryCache(),
});
