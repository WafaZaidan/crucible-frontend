import { BigNumber } from '@ethersproject/bignumber';
import { ethers, Signer } from 'ethers';
import { crucibleAbi } from '../abi/crucibleAbi';
import { client as apolloClient } from '../config/apollo';
import { GET_PAIR_DATA } from '../queries/uniswap';

interface TransactionData {
  status: string;
  message: string;
  result: Transaction[];
}

interface Transaction {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: BigNumber;
  gasPrice: BigNumber;
  gasUsed: BigNumber;
  hash: string;
  input: string;
  nonce: string;
  timeStamp: string;
  to: string;
  tokenDecimal: string;
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: string;
  value: BigNumber;
}

interface Asset {
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  value: BigNumber;
}

export interface AssetWithBalance {
  [key: string]: Asset;
}

const tokenSymbolFromPair = async (
  pairAddress: string,
  tokenSymbol: string,
  chainId: number
) => {
  // Uniswap only have a graph node for mainnet
  if (chainId !== 1) {
    return tokenSymbol;
  }
  try {
    const { data } = await apolloClient.query({
      query: GET_PAIR_DATA(pairAddress),
    });
    return data.pair.token0.symbol + ' - ' + data.pair.token1.symbol + ' LP';
  } catch (e) {
    console.log(e);
    return tokenSymbol;
  }
};

export const getContainedAssets = async (
  address: string,
  chainId: number,
  etherscanApiKey: string,
  signer: Signer
) => {
  const endpoint =
    chainId === 1
      ? `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${etherscanApiKey}`
      : `https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${etherscanApiKey}`;

  try {
    const response = await fetch(endpoint);
    const data: TransactionData = await response.json();

    const assetsWithBalance: AssetWithBalance = {};

    if (data.message !== 'OK') {
      throw new Error((data.result as unknown) as string);
    }

    data.result.map((tx) => {
      if (tx.contractAddress in assetsWithBalance) {
        assetsWithBalance[tx.contractAddress] = {
          ...assetsWithBalance[tx.contractAddress],
          value:
            tx.from === address
              ? assetsWithBalance[tx.contractAddress].value.sub(
                  BigNumber.from(tx.value)
                )
              : assetsWithBalance[tx.contractAddress].value.add(
                  BigNumber.from(tx.value)
                ),
        };
      } else {
        assetsWithBalance[tx.contractAddress] = {
          contractAddress: tx.contractAddress,
          tokenName: tx.tokenName,
          tokenSymbol: tx.tokenSymbol,
          value:
            tx.from === address
              ? BigNumber.from(tx.value).mul(-1)
              : BigNumber.from(tx.value),
        };
      }
      return tx;
    });

    Object.keys(assetsWithBalance).map((key) => {
      if (assetsWithBalance[key].value.lte(0)) {
        delete assetsWithBalance[key];
      }
      return null;
    });

    const resultsArray = [];

    for (const o in assetsWithBalance) {
      resultsArray.push(assetsWithBalance[o]);
    }

    const updatedResult = Promise.all(
      resultsArray.map(async (result) => {
        if (result.tokenSymbol === 'UNI-V2') {
          // Get unlocked balance
          const contract = new ethers.Contract(address, crucibleAbi, signer);
          const lockedBalance = await contract.getBalanceLocked(
            result.contractAddress
          );
          const unlockedBalance = result.value.sub(lockedBalance);

          // Create a custom token symbol to replace UNI-V2
          const tokenSymbol = await tokenSymbolFromPair(
            result.contractAddress,
            result.tokenSymbol,
            chainId
          );

          return {
            ...result,
            tokenSymbol,
            value: unlockedBalance,
          };
        } else {
          return {
            ...result,
          };
        }
      })
    );

    return updatedResult;
  } catch (err) {
    throw err;
  }
};
