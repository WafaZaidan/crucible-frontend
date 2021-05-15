import { ApolloClient, InMemoryCache } from '@apollo/client';
import config from '../config';

const { uniswapSubgraphUrl } = config;

export const client = new ApolloClient({
  uri: uniswapSubgraphUrl,
  cache: new InMemoryCache(),
});
