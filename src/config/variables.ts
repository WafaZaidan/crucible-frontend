import { Network } from '../utils/network';

export const config =
  process.env.REACT_APP_NETWORK_ID === '1'
    ? {
        networkId: Network.MAINNET,
        appUrl: 'https://alchemist.wtf',
        contactEmail: 'foo@gmail.com',
        pairAddress: '0xcd6bcca48069f8588780dfa274960f15685aee0e',
        mistTokenAddress: '0x88ACDd2a6425c3FaAE4Bc9650Fd7E27e0Bebb7aB',
        inflationStartTimestamp: 1612661126000,
        lpTokenAddress: '0xCD6bcca48069f8588780dFA274960F15685aEe0e',
        aludelAddress: '0xf0D415189949d913264A454F57f4279ad66cB24d',
        wethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        crucibleFactoryAddress: '0x54e0395CFB4f39beF66DBCd5bD93Cca4E9273D56',
        transmuterAddress: '0xB772ce9f14FC7C7db0D4525aDb9349FBD7ce456a',
        daiAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        rewardPool: '0x04108d6E9a51BeC5170F8Fd953a156cF754bA541',
        rpcUrl: 'https://mainnet.infura.io/v3/00a5b13ef0cf467698571093487743e6',
        infuraApiKey: '00a5b13ef0cf467698571093487743e6',
        dappId: 'ad454b00-3218-4403-95e9-22c3c7d3adc0',
        uniswapSubgraphUrl:
          'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
        uniswapPoolUrl: 'http://lp.mist.alchemist.wtf',
        getMistUrl: 'http://swap.mist.alchemist.wtf', // V2
        // 'https://app.uniswap.org/#/swap?outputCurrency=0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab', // will point to v3,
        mintCrucibleDoc:
          'https://docs.alchemist.wtf/mist/crucible/guides-crucible.alchemist.wtf/how-do-i-mint-a-crucible',
        lpTokensDoc:
          'https://docs.alchemist.wtf/mist/acquiring-and-subscribing#2-subscribing-usdmist-to-receive-lp-tokens',
        aludelRewardsDoc:
          'https://docs.alchemist.wtf/mist/crucible/teach-me-about-crucibles',
      }
    : {
        networkId: Network.RINKEBY,
        appUrl: 'https://alchemist.wtf',
        contactEmail: 'foo@gmail.com',
        pairAddress: '0xcd6bcca48069f8588780dfa274960f15685aee0e',
        inflationStartTimestamp: 1617299925000,
        mistTokenAddress: '0xF6c1210Aca158bBD453A12604A03AeD2659ac0ef',
        lpTokenAddress: '0xe55687682fdf08265d1672ea0c91fa884ccd8955',
        aludelAddress: '0xE2dD7930d8cA478d9aA38Ae0F5483B8A3B331C40',
        wethAddress: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
        crucibleFactoryAddress: '0xf92D86483438BDe1d68e501ce15470155DeE08B3',
        transmuterAddress: '0x0ADc14De42436aD95747a1C9A8002D4E60888ACa',
        daiAddress: '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea',
        rewardPool: '0x60dd59e72B2468C64fD9F369488aedf9b5F65Ffe',
        rpcUrl: 'https://rinkeby.infura.io/v3/00a5b13ef0cf467698571093487743e6',
        infuraApiKey: '00a5b13ef0cf467698571093487743e6',
        dappId: 'ad454b00-3218-4403-95e9-22c3c7d3adc0',
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
