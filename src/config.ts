import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { PortisConnector } from '@web3-react/portis-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

const config = {
  supportedNetworks: [1, 4],
  appUrl: 'https://alchemist.wtf',
  contactEmail: 'foo@gmail.com',
  inflationStartTimestamp: 1612661126000,
  uniswapSubgraphUrl:
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  mintCrucibleDoc:
    'https://docs.alchemist.wtf/mist/crucible/guides-crucible.alchemist.wtf/how-do-i-mint-a-crucible',
  lpTokensDoc:
    'https://docs.alchemist.wtf/mist/acquiring-and-subscribing#2-subscribing-usdmist-to-receive-lp-tokens',
  aludelRewardsDoc:
    'https://docs.alchemist.wtf/mist/crucible/teach-me-about-crucibles',
  blocknativeApiKey: 'ad454b00-3218-4403-95e9-22c3c7d3adc0',
  portisApiKey: 'e86e917b-b682-4a5c-bbc5-0f8c3b787562',
};

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

export const portisConnector = new PortisConnector({
  dAppId: config.portisApiKey,
  networks: [1, 4],
});

export const walletlinkConnector = new WalletLinkConnector({
  url: 'https://mainnet.infura.io/v3/00a5b13ef0cf467698571093487743e6',
  appName: 'crucible.alchemist.wtf',
});

export default config;
