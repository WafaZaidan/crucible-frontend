import { ethers } from 'ethers';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { THUNK_PREFIX } from '../../enum';
import { crucibleAbi } from '../../../abi/crucibleAbi';
import { aludelAbi } from '../../../abi/aludelAbi';
import { signPermission } from '../../../contracts/utils';
import { TxnStatus, TxnType } from '../types';
import bigNumberishToNumber from '../../../utils/bigNumberishToNumber';

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
    const description = `Unsubscribe ${bigNumberishToNumber(amountLp)} LP`;
    const { library, account, chainId } = web3React;
    const signer = library.getSigner();
    const { aludelAddress } = config;

    updateTx({
      type: TxnType.unsubscribe,
      status: TxnStatus.Initiated,
      description,
    });

    //set up the aludel, staking, factory and transmuter contract instances
    const aludel = new ethers.Contract(aludelAddress, aludelAbi, signer);

    const { stakingToken: tokenAddress } = await aludel.getAludelData();

    const stakingToken = new ethers.Contract(
      tokenAddress,
      IUniswapV2ERC20.abi,
      signer
    );

    const crucible = new ethers.Contract(crucibleAddress, crucibleAbi, signer);
    const nonce = await crucible.getNonce();

    // validate balances
    if ((await stakingToken.balanceOf(crucible.address)).lt(amountLp)) {
      throw new Error('You do not have enough LP tokens');
    }

    updateTx({
      type: TxnType.unsubscribe,
      status: TxnStatus.PendingApproval,
      description,
      account,
      chainId,
    });

    const permission = await signPermission(
      'Unlock',
      crucible,
      signer,
      aludel.address,
      stakingToken.address,
      amountLp,
      nonce
    );

    const populatedTransaction = await aludel.populateTransaction.unstakeAndClaim(
      crucible.address,
      account,
      amountLp,
      permission
    );

    const unstakeTx = await signer.sendTransaction(populatedTransaction);
    const withdrawTx = await crucible.transferERC20(
      stakingToken.address,
      account,
      amountLp
    );

    monitorTx(withdrawTx.hash);

    updateTx({
      type: TxnType.unsubscribe,
      status: TxnStatus.PendingOnChain,
      description,
      account,
      chainId,
      hash: withdrawTx.hash,
    });

    await unstakeTx.wait(1);
    await withdrawTx.wait(1);

    updateTx({
      type: TxnType.unsubscribe,
      status: TxnStatus.Mined,
      description,
      account,
      chainId,
      hash: withdrawTx.hash,
    });
  }
);

export default unsubscribeLP;
