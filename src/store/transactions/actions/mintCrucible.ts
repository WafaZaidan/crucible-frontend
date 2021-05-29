import { ethers } from 'ethers';
import { randomBytes } from 'ethers/lib/utils';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { THUNK_PREFIX } from '../../enum';
import { crucibleAbi } from '../../../abi/crucibleAbi';
import { transmuterAbi } from '../../../abi/transmuterAbi';
import { aludelAbi } from '../../../abi/aludelAbi';
import { crucibleFactoryAbi } from '../../../abi/crucibleFactoryAbi';
import { signPermission, signPermitEIP2612 } from '../../../contracts/utils';
import { wait } from '../../../utils/wait';
import { TxnStatus, TxnType } from '../types';
import bigNumberishToNumber from '../../../utils/bigNumberishToNumber';

export const mintCrucible = createAsyncThunk(
  THUNK_PREFIX.MINT_CRUCIBLE,
  async ({ web3React, config, monitorTx, updateTx, amountLp }: any) => {
    const description = `Create Crucible with ${bigNumberishToNumber(
      amountLp
    )} LP`;

    updateTx({
      type: TxnType.mint,
      status: TxnStatus.Initiated,
      description,
    });

    const { library, account, chainId } = web3React;
    const signer = library.getSigner();
    const { crucibleFactoryAddress, aludelAddress, transmuterAddress } = config;
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

    //check if user has enough LP
    if ((await stakingToken.balanceOf(account)).lt(amountLp)) {
      throw new Error('Not enough balance');
    }

    updateTx({
      type: TxnType.mint,
      status: TxnStatus.PendingApproval,
      description,
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
      type: TxnType.mint,
      status: TxnStatus.PendingOnChain,
      description,
      account,
      chainId,
      hash: tx.hash,
    });

    await tx.wait(1);

    updateTx({
      type: TxnType.mint,
      status: TxnStatus.Mined,
      description,
      account,
      chainId,
      hash: tx.hash,
    });
  }
);

export default mintCrucible;
