import {
  CoinGeckoIcon,
  DiscordIcon,
  EtherscanIcon,
  GithubIcon,
  UniswapIcon,
} from '../components/icons';

export const externalLinks = [
  {
    label: 'Discord',
    icon: DiscordIcon,
    href: 'http://discord.alchemist.wtf',
  },
  {
    label: 'Code',
    icon: GithubIcon,
    href: 'https://github.com/alchemistcoin/crucible-frontend',
  },
  {
    label: 'Etherscan',
    icon: EtherscanIcon,
    href:
      'https://etherscan.io/token/0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab',
  },
  {
    label: 'Uniswap',
    icon: UniswapIcon,
    href:
      'https://app.uniswap.org/#/add/v2/0x88ACDd2a6425c3FaAE4Bc9650Fd7E27e0Bebb7aB/ETH', // using v2 add liquidity link for now
    // 'https://info.uniswap.org/token/v2/0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab', // v3
  },
  {
    label: 'CoinGecko',
    icon: CoinGeckoIcon,
    href: 'https://www.coingecko.com/en/coins/alchemist',
  },
];

export const internalLinks = [
  // {
  //   label: 'Home',
  //   to: '/',
  // },
  {
    label: 'Crucible minting',
    to: '/',
  },
  // {
  //   label: 'FAQs',
  //   to: '/faqs',
  // },
];
