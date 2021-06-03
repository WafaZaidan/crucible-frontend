import { ethers } from 'ethers';
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

export const unsubscribeLP = createAsyncThunk(
  THUNK_PREFIX.UNSUBSCRIBE_LP,
  async ({
    web3React,
    config,
    monitorTx,
    updateTx,
    amountLp,
    crucibleAddress,
  }: any) => {
    const txnId = uuid();
    const description = `Unsubscribe ${bigNumberishToNumber(amountLp)} LP`;
    const { library, account, chainId } = web3React;
    const signer = library.getSigner();
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

      // populate a txn object for unstake & claim
      const populatedTransaction = await aludel.populateTransaction.unstakeAndClaim(
        crucible.address,
        account,
        amountLp,
        permission
      );

      // send the unstake & claim transaction - user confirms with wallet
      const unstakeTx = await signer.sendTransaction(populatedTransaction);

      // monitor the unstaking tx
      monitorTx(unstakeTx.hash);

      // set txn to "pending"
      updateTx({
        id: txnId,
        status: TxnStatus.PendingOnChain,
        hash: unstakeTx.hash,
      });

      // wait for tokens to  be unstaked...
      await unstakeTx.wait(1);

      // withdraw tokens
      const withdrawTx = await crucible.transferERC20(
        stakingToken.address,
        account,
        amountLp
      );

      // monitor the withdraw tx
      monitorTx(withdrawTx.hash);

      // wait for txn to complete
      await withdrawTx.wait(1);

      // mark as success
      updateTx({
        id: txnId,
        status: TxnStatus.Mined,
      });
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
