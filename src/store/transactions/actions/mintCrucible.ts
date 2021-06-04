import { ethers } from 'ethers';
import { randomBytes } from 'ethers/lib/utils';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import { THUNK_PREFIX } from '../../enum';
import { crucibleAbi } from '../../../abi/crucibleAbi';
import { transmuterAbi } from '../../../abi/transmuterAbi';
import { aludelAbi } from '../../../abi/aludelAbi';
import { crucibleFactoryAbi } from '../../../abi/crucibleFactoryAbi';
import { signPermission, signPermitEIP2612 } from '../../../contracts/utils';
import { wait } from '../../../utils/wait';
import { TxnStatus, TxnType } from '../types';
import bigNumberishToNumber from '../../../utils/bigNumberishToNumber';
import { v4 as uuid } from 'uuid';
import parseTransactionError from '../../../utils/parseTransactionError';

export const mintCrucible = createAsyncThunk(
  THUNK_PREFIX.MINT_CRUCIBLE,
  async ({ web3React, config, monitorTx, updateTx, amountLp }: any) => {
    const txnId = uuid();
    const description = `Create Crucible with ${bigNumberishToNumber(
      amountLp
    )} LP`;

    updateTx({
      id: txnId,
      type: TxnType.mint,
      status: TxnStatus.Initiated,
      description,
    });

    try {
      const { library, account, chainId } = web3React;
      const signer = library.getSigner();
      const { crucibleFactoryAddress, aludelAddress, transmuterAddress } =
        config;
      const salt = randomBytes(32);
      const deadline =
        (await library.getBlock('latest')).timestamp + 60 * 60 * 24;

      //set up the aludel, staking, factory and transmuter contract instances
      const aludel = new ethers.Contract(aludelAddress, aludelAbi, signer);

      const stakingToken = new ethers.Contract(
        (await aludel.getAludelData()).stakingToken,
        IUniswapV2ERC20.abi,
        signer
      );

      const crucibleFactory = new ethers.Contract(
        crucibleFactoryAddress,
        crucibleFactoryAbi,
        signer
      );

      const transmuter = new ethers.Contract(
        transmuterAddress,
        transmuterAbi,
        signer
      );

      updateTx({
        id: txnId,
        status: TxnStatus.PendingApproval,
        account,
        chainId,
      });

      //craft permission
      const crucible = new ethers.Contract(
        await transmuter.predictDeterministicAddress(
          await crucibleFactory.getTemplate(),
          salt,
          crucibleFactory.address
        ),
        crucibleAbi,
        signer
      );

      //Signature #1
      const permit = await signPermitEIP2612(
        signer,
        account,
        stakingToken,
        transmuter.address,
        amountLp,
        deadline
      );

      //short wait so that metamask can pop up the second signature request
      await wait(300);

      //signature #2
      const permission = await signPermission(
        'Lock',
        crucible,
        signer,
        aludel.address,
        stakingToken.address,
        amountLp,
        0
      );

      // wallet confirmation
      const tx = await transmuter.mintCruciblePermitAndStake(
        aludel.address,
        crucibleFactory.address,
        account,
        salt,
        permit,
        permission
      );

      monitorTx(tx.hash);

      updateTx({
        id: txnId,
        status: TxnStatus.PendingOnChain,
        hash: tx.hash,
      });

      await tx.wait(1);

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

export default mintCrucible;
