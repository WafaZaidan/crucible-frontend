import { BigNumberish, ethers, providers, Wallet } from 'ethers';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { THUNK_PREFIX } from '../../enum';
import { crucibleAbi } from '../../../abi/crucibleAbi';
import { aludelAbi } from '../../../abi/aludelAbi';
import { signPermission } from '../../../contracts/utils';
import { TxnStatus, TxnType } from '../types';
import bigNumberishToNumber from '../../../utils/bigNumberishToNumber';
import parseTransactionError from '../../../utils/parseTransactionError';
import { PopulatedTransaction } from '@ethersproject/contracts';
import { keccak256 } from '@ethersproject/keccak256';
import { SignatureLike } from '@ethersproject/bytes';
import {
  FlashbotsBundleProvider,
  FlashbotsTransactionResponse,
} from '@flashbots/ethers-provider-bundle';

export const unsubscribeLP = createAsyncThunk(
  THUNK_PREFIX.UNSUBSCRIBE_LP,
  async ({
    web3React,
    config,
    // monitorTx, // TODO: Figure out how to monitor flashbots txns
    updateTx,
    amountLp,
    crucibleAddress,
  }: any) => {
    const txnId = uuid();
    const description = `Unsubscribe ${bigNumberishToNumber(amountLp)} LP`;
    const { library, account, chainId } = web3React;
    const signer = library.getSigner();
    let chainName = (await signer.provider.getNetwork()).chainName;
    const { aludelAddress } = config;

    updateTx({
      id: txnId,
      type: TxnType.unsubscribe,
      status: TxnStatus.Initiated,
      description,
    });

    try {
      //set up the contract instances
      const aludel = new ethers.Contract(aludelAddress, aludelAbi, signer);

      // get the aludel token address ...?
      const { stakingToken: tokenAddress } = await aludel.getAludelData();

      // create aludel contract instance?
      const stakingToken = new ethers.Contract(
        tokenAddress,
        IUniswapV2ERC20.abi,
        signer
      );

      // create contract instance for the relevant crucible
      const crucible = new ethers.Contract(
        crucibleAddress,
        crucibleAbi,
        signer
      );

      const nonce = await crucible.getNonce();

      updateTx({
        id: txnId,
        status: TxnStatus.PendingApproval,
        account,
        chainId,
      });

      // get user to sign unlock permissions
      const permission = await signPermission(
        'Unlock',
        crucible,
        signer,
        aludel.address,
        stakingToken.address,
        amountLp,
        nonce
      );

      updateTx({
        id: txnId,
        status: TxnStatus.PendingOnChain,
      });

      const estimatedGas = await aludel.estimateGas.unstakeAndClaim(
        crucible.address,
        account,
        amountLp,
        permission
      );

      let estimateGasPrice: BigNumberish = 0;

      await fetch(
        'https://www.gasnow.org/api/v3/gas/price?utm_source=:crucible'
      )
        .then((response) => response.json())
        .then((result) => {
          // eslint-disable-next-line eqeqeq
          if (result.code == 200) {
            if (result.data.fast > 0 && result.data.rapid > 0) {
              estimateGasPrice = ethers.BigNumber.from(result.data.rapid)
                .sub(ethers.BigNumber.from(result.data.fast))
                .div(2)
                .add(ethers.BigNumber.from(result.data.fast));
            } else {
              throw Error(
                'Gasprice returned by API is too low, please try again.'
              );
            }
          } else {
            throw Error(
              'Unable to retrieve Gas price from API, please try again.'
            );
          }
        })
        .catch((error) => {
          throw error;
        });

      let gasCalculation =
        ethers.BigNumber.from(estimateGasPrice).mul(estimatedGas);

      //Console notices for Gas Cost - Please retain for debugging
      console.log(
        'Estimated Gas Price: ' +
          ethers.utils.formatUnits(estimateGasPrice, 'gwei') +
          ' Gwei'
      );
      console.log('Estimated Gas Required: ' + estimatedGas + ' units');
      console.log(
        'Estimated Total Cost ' +
          ethers.utils.formatEther(gasCalculation) +
          ' ETH'
      );

      let populatedResponse = {};
      let hash: string = '';
      let serialized;

      let nonce_user = await aludel.signer.getTransactionCount();

      await aludel.populateTransaction
        .unstakeAndClaim(crucible.address, account, amountLp, permission, {
          nonce: nonce_user,
          gasLimit: estimatedGas,
          gasPrice: estimateGasPrice,
        })
        .then((response: PopulatedTransaction) => {
          delete response.from;
          response.chainId = chainId;
          serialized = ethers.utils.serializeTransaction(response);
          hash = keccak256(serialized);
          populatedResponse = response;
          return populatedResponse;
        });

      let isMetaMask: boolean | undefined;

      if (signer.provider.provider.isMetaMask) {
        isMetaMask = signer.provider.provider.isMetaMask;
        signer.provider.provider.isMetaMask = false;
      }

      const getSignature_unstake = await signer.provider
        .send('eth_sign', [account.toLowerCase(), ethers.utils.hexlify(hash)])
        .then((signature: SignatureLike) => {
          const txWithSig = ethers.utils.serializeTransaction(
            populatedResponse,
            signature
          );
          return txWithSig;
        })
        .finally(() => {
          if (signer.provider.provider.isMetaMask) {
            signer.provider.provider.isMetaMask = isMetaMask;
          }
        });

      //flashbots API variables
      const flashbotsAPI =
        chainId == 1 ? '/flashbots-relay-mainnet/' : '/flashbots-relay-goerli/';

      //Flashbots Initilize
      const provider = providers.getDefaultProvider();
      const authSigner = Wallet.createRandom();
      const wallet = Wallet.createRandom().connect(provider);

      // Flashbots provider requires passing in a standard provider
      const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider, // a normal ethers.js provider, to perform gas estimiations and nonce lookups
        authSigner, // ethers.js signer wallet, only for signing request payloads, not transactions
        flashbotsAPI,
        chainName
      );

      const flashbotsTransactionBundle = [
        {
          signer: wallet,
          transaction: {
            to: wallet.address,
            gasPrice: 0,
          },
        },
        {
          signedTransaction: getSignature_unstake,
        },
      ];

      const blockNumber = await provider.getBlockNumber();

      const minTimestamp = (await provider.getBlock(blockNumber)).timestamp;
      const maxTimestamp = minTimestamp + 240; // 60 * 4 min max timeout

      const signedTransactions = await flashbotsProvider.signBundle(
        flashbotsTransactionBundle
      );

      const simulation = await flashbotsProvider.simulate(
        signedTransactions,
        blockNumber + 1
      );

      if ('error' in simulation) {
        throw Error(simulation.error.message);
      }

      const data = await Promise.all(
        Array.from(Array(15).keys()).map(async (v) => {
          const response = (await flashbotsProvider.sendBundle(
            flashbotsTransactionBundle,
            blockNumber + 1 + v,
            {
              minTimestamp,
              maxTimestamp,
            }
          )) as FlashbotsTransactionResponse;
          console.log(
            'Submitting Bundle to Flashbots for inclusion attempt on Block ' +
              (blockNumber + 1 + v)
          );
          return response;
        })
      );

      let successFlag = 0;

      await Promise.all(
        data.map(async (v, i) => {
          const response = await v.wait();

          // Useful for debugging block response from FlashBots
          console.log('Bundle ' + i + ' Response: ' + response);

          if (response == 0) {
            successFlag = 1;

            const txReceipt = await v.receipts();

            updateTx({
              id: txnId,
              status: TxnStatus.Mined,
              hash: txReceipt[1].transactionHash,
            });

            return;
          }
        })
      );

      if (successFlag == 0) {
        throw Error(
          'Failed to get Bundle included via Flashbots, please try again.'
        );
      }
    } catch (error) {
      const errorMessage = parseTransactionError(error);

      updateTx({
        id: txnId,
        status: TxnStatus.Failed,
        error: errorMessage,
      });

      // trigger redux toolkit's rejected.match hook
      throw error;
    }
  }
);

export default unsubscribeLP;
