import { BigNumber } from '@ethersproject/bignumber';
import { tokenSymbolFromPair } from './tokenSymbol';

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

export interface ContainedAsset {
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  value: BigNumber;
}

export interface Assets {
  [key: string]: ContainedAsset;
}

export const getContainedAssets = async (
  address: string,
  chainId: number,
  etherscanApiKey: string
) => {
  const endpoint =
    chainId === 1
      ? `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${etherscanApiKey}`
      : `https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${etherscanApiKey}`;

  try {
    const response = await fetch(endpoint);
    const data: TransactionData = await response.json();

    const assets: Assets = {};
    const assetsDetail: ContainedAsset[] = [];

    if (data.message !== 'OK') {
      throw new Error((data.result as unknown) as string);
    }

    data.result.forEach((tx) => {
      assets[tx.contractAddress] = {
        ...tx,
      };
    });

    for (const o in assets) {
      assetsDetail.push(assets[o]);
    }

    const containedAssets: Promise<ContainedAsset[]> = Promise.all(
      assetsDetail.map(async (result) => {
        if (result.tokenSymbol === 'UNI-V2') {
          // Create a custom token symbol to replace 'UNI-V2'
          const tokenSymbol = await tokenSymbolFromPair(
            result.contractAddress,
            result.tokenSymbol,
            chainId
          );
          return {
            ...result,
            tokenSymbol,
          };
        } else {
          return {
            ...result,
          };
        }
      })
    );

    return containedAssets;
  } catch (err) {
    throw err;
  }
};
