import React from 'react';
import ReactDOM from 'react-dom';
import { Web3ReactProvider } from '@web3-react/core';
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from './config/theme';
import { TokenProvider } from './context/tokens';
import { config } from './config/variables';
import { TransactionProvider } from './context/transactions';
import { NetworkStatsProvider } from './context/network';
import { CruciblesProvider } from './context/crucibles';
import { LpStatsProvider } from './context/lp';
import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import { GlobalStyles } from './styles/global-styles';
import { Global } from '@emotion/react';
import { client } from './config/apollo';
import { ethers } from 'ethers';

import 'focus-visible/dist/focus-visible';

const { mistTokenAddress, lpTokenAddress, networkId } = config;

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider);
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <TokenProvider
        tokensToWatch={{
          [networkId]: [
            {
              address: mistTokenAddress,
              name: 'Mist',
              symbol: '⚗️',
            },
            {
              address: lpTokenAddress,
              name: 'LP',
              symbol: '🧙',
            },
          ],
        }}
      >
        <ApolloProvider client={client}>
          <TransactionProvider>
            <NetworkStatsProvider>
              <CruciblesProvider>
                <LpStatsProvider>
                  <ChakraProvider theme={theme}>
                    <Global styles={GlobalStyles} />
                    <App />
                  </ChakraProvider>
                </LpStatsProvider>
              </CruciblesProvider>
            </NetworkStatsProvider>
          </TransactionProvider>
        </ApolloProvider>
      </TokenProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
