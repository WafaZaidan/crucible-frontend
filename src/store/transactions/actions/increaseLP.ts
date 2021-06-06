import { ethers } from 'ethers';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { THUNK_PREFIX } from '../../enum';
import { crucibleAbi } from '../../../abi/crucibleAbi';
import { transmuterAbi } from '../../../abi/transmuterAbi';
import { aludelAbi } from '../../../abi/aludelAbi';
import { signPermission, signPermitEIP2612 } from '../../../contracts/utils';
import { wait } from '../../../utils/wait';
import { TxnStatus, TxnType } from '../types';
import bigNumberishToNumber from '../../../utils/bigNumberishToNumber';
import parseTransactionError from '../../../utils/parseTransactionError';

export const increaseLP = createAsyncThunk(
  THUNK_PREFIX.INCREASE_LP,
  async ({
    web3React,
    config,
    monitorTx,
    updateTx,
    toast,
    amountLp,
    crucibleAddress,
  }: any) => {
    // create UUID for tracking this tx
    const txnId = uuid();

    const description = `Increase staking position by ${bigNumberishToNumber(
      amountLp
    )} LP`;

    console.log('updatingTX: ', TxnType.increaseLp);
    updateTx({
      id: txnId,
      type: TxnType.increaseLp,
      status: TxnStatus.Initiated,
      description,
    });

    try {
      const { library, account, chainId } = web3React;
      const signer = library.getSigner();
      const { aludelAddress, transmuterAddress } = config;

      //set up the required contract instances
      const aludel = new ethers.Contract(aludelAddress, aludelAbi, signer);

      const { stakingToken: tokenAddress } = await aludel.getAludelData();

      const stakingToken = new ethers.Contract(
        tokenAddress,
        IUniswapV2ERC20.abi,
        signer
      );

      const crucible = new ethers.Contract(
        crucibleAddress,
        crucibleAbi,
        signer
      );

      const transmuter = new ethers.Contract(
        transmuterAddress,
        transmuterAbi,
        signer
      );

      const nonce = await crucible.getNonce();
      const deadline = Date.now() + 60 * 60 * 24; // 1 day deadline

      console.log('updatingTX: ', TxnStatus.PendingApproval);
      updateTx({
        id: txnId,
        status: TxnStatus.PendingApproval,
        account,
        chainId,
      });

      toast({
        title: 'Pending signature (1 of 2)',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });

      // open metamask modal and request 1st signature
      const permit = await signPermitEIP2612(
        signer,
        account,
        stakingToken,
        transmuter.address,
        amountLp,
        deadline
      );

      // needed for metamask to pop up the 2nd signature confirmation
      await wait(300);

      toast({
        title: 'Pending signature (2 of 2)',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });

      const permission = await signPermission(
        'Lock',
        crucible,
        signer,
        aludel.address,
        stakingToken.address,
        amountLp,
        nonce
      );

      //
      const tx = await transmuter.permitAndStake(
        aludel.address,
        crucibleAddress,
        permit,
        permission
      );

      monitorTx(tx.hash);

      console.log('updatingTX: ', TxnStatus.PendingOnChain);
      updateTx({
        id: txnId,
        status: TxnStatus.PendingOnChain,
        hash: tx.hash,
      });

      await tx.wait(1);

      console.log('updatingTX: ', TxnStatus.Mined);
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

export default increaseLP;
