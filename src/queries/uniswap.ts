import { gql } from '@apollo/client';

export const GET_TOTAL_VOLUME = gql`
  query getTotalVolume($pairAddress: String!) {
    pairs(where: { id: $pairAddress }) {
      id
      reserveUSD
    }
  }
`;
export const GET_UNISWAP_MINTS = gql`
  query getUserMints($userAddress: String!) {
    mints(
      where: {
        to: $userAddress
        pair: "0xcd6bcca48069f8588780dfa274960f15685aee0e"
      }
    ) {
      id
      timestamp
      transaction {
        id
      }
      amount0
      amount1
      pair {
        id
        token0 {
          id
          symbol
          derivedETH
        }
        token1 {
          id
          symbol
          derivedETH
        }
      }
      amountUSD
    }
  }
`;

export const GET_PRICES = gql`
  query getPrices($beforeTimestamp: Int!, $afterTimestamp: Int!) {
    wethPriceUSD: tokenDayDatas(
      where: {
        date_lt: $beforeTimestamp
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
        date_gt: $afterTimestamp
      }
    ) {
      id
      date
      priceUSD
    }
    mistPriceUSD: tokenDayDatas(
      where: {
        token: "0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab"
        date_lt: $beforeTimestamp
        date_gt: $afterTimestamp
      }
    ) {
      id
      date
      priceUSD
    }
  }
`;

export const GET_PAIR_HISTORY = (address: string, timestamps: number[]) => {
  let queryString = ``;
  // eslint-disable-next-line array-callback-return
  timestamps.map((timestamp, i) => {
    queryString += `
      pairHour${i}: pairHourDatas(
        where: {
          pair: "${address}"
          hourStartUnix_lte: ${timestamp}
          hourStartUnix_gte: ${timestamp - 3600}
        }
      ) {
        id
        reserve0
        reserve1
        hourStartUnix
        reserveUSD
        pair {
          totalSupply
        }
      }
      pairDay${i}: pairDayDatas(
        where: {
          pairAddress: "${address}",
          date_lte:${timestamp}
          date_gte:${timestamp - 3600 * 24}
        }){
          totalSupply
          reserve0
          reserve1
      }
    `;
  });
  let wrappedQuery = `query getPrices{${queryString}}`;
  return gql`
    ${wrappedQuery}
  `;
};

export const GET_PAIR_DATA = (pairAddress: string) => gql`
  query GetPairData {
    pair(id: "${pairAddress}") {
      id
      token0 {
        name
        symbol
      }
      token1 {
        name
        symbol
      }
    }
  }
`;

// {
//   # Mist Pair Address: 0xcd6bcca48069f8588780dfa274960f15685aee0e
//     liquidityPositionSnapshots(id:"0xcd6bcca48069f8588780dfa274960f15685aee0e-0x365595AB460cB664c77d4e038c9051f09D781065",  block: {number: 10291203}) {
//       id
//       user{
//         id
//       }
//       liquidityTokenBalance

//     }
//   }

// Get's one inch lp positions at time (in block height)
// {
//   liquidityPositionSnapshots(where:{
//     user: "0x11111254369792b2ca5d084ab5eea397ca8fa48b"
//   },block: {number: 12191203}) {
//   id
//   user{
//     id
//   }
//   liquidityTokenBalance

// }
// }

// {
//   pairDayDatas(where:{
//     pairAddress: "0xcd6bcca48069f8588780dfa274960f15685aee0e"
//   }) {
//   id
//   token0{
//     id
//   }
//   token1{
//     id
//   }
//   reserve0
// }
// }
