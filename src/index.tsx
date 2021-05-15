import React from 'react';
import ReactDOM from 'react-dom';
import { Web3ReactProvider } from '@web3-react/core';
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from './config/theme';
import { TokenProvider } from './context/tokens';
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

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider);
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <TokenProvider>
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

reportWebVitals();
