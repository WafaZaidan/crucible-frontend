import { config } from './variables';
import { Initialization } from 'bnc-onboard/dist/src/interfaces';

const {
  networkId,
  dappId,
  rpcUrl,
  // appUrl,
  // contactEmail,
  infuraApiKey,
} = config;

const onboardConfig: Initialization = {
  networkId: networkId,
  dappId: dappId,
  hideBranding: true,
  darkMode: true,
  walletSelect: {
    wallets: [
      { walletName: 'metamask', preferred: true },
      { walletName: 'trust', preferred: true },
      // {
      //   walletName: 'trezor',
      //   appUrl: appUrl,
      //   email: contactEmail,
      //   rpcUrl: rpcUrl,
      //   preferred: false,
      // },
      // {
      //   walletName: 'ledger',
      //   rpcUrl: rpcUrl,
      //   preferred: false,
      // },
      {
        walletName: 'walletConnect',
        infuraKey: infuraApiKey,
        preferred: true,
      },
      { walletName: 'imToken', rpcUrl: rpcUrl, preferred: true },
      { walletName: 'trust', preferred: true },
    ],
  },
  walletCheck: [
    { checkName: 'derivationPath' },
    { checkName: 'connect' },
    { checkName: 'accounts' },
    { checkName: 'network' },
  ],
};

export default onboardConfig;
