import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const config = {
  supportedNetworks: [1, 4],
  appUrl: 'https://alchemist.wtf',
  contactEmail: 'foo@gmail.com',
  inflationStartTimestamp: 1612661126000,
  uniswapSubgraphUrl:
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  uniswapPoolUrl:
    'https://app.uniswap.org/#/add/v2/0xF6c1210Aca158bBD453A12604A03AeD2659ac0ef/ETH',
  getMistUrl:
    'https://app.uniswap.org/#/swap?outputCurrency=0xF6c1210Aca158bBD453A12604A03AeD2659ac0ef&use=V2',
  mintCrucibleDoc:
    'https://docs.alchemist.wtf/mist/crucible/guides-crucible.alchemist.wtf/how-do-i-mint-a-crucible',
  lpTokensDoc:
    'https://docs.alchemist.wtf/mist/acquiring-and-subscribing#2-subscribing-usdmist-to-receive-lp-tokens',
  aludelRewardsDoc:
    'https://docs.alchemist.wtf/mist/crucible/teach-me-about-crucibles',
};

// @ts-ignore
export const injectedConnector = new InjectedConnector({
  supportedChainIds: config.supportedNetworks,
});

export const walletconnectConnector = new WalletConnectConnector({
  rpc: {
    1: 'https://mainnet.infura.io/v3/00a5b13ef0cf467698571093487743e6',
    4: 'https://rinkeby.infura.io/v3/00a5b13ef0cf467698571093487743e6',
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 12000,
});

export default config;
