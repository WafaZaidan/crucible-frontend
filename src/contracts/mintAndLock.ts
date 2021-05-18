import { BigNumber, ethers, providers, Signer } from 'ethers';
import { randomBytes } from 'ethers/lib/utils';
import { signPermission, signPermitEIP2612 } from './utils';
import { aludelAbi } from '../abi/aludelAbi';
import { transmuterAbi } from '../abi/transmuterAbi';
import { crucibleFactoryAbi } from '../abi/crucibleFactoryAbi';
import { crucibleAbi } from '../abi/crucibleAbi';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { CallbackArgs, EVENT } from '../hooks/useContract';
import { wait } from '../utils/wait';
import {
  TxnStatus,
  TxnType,
  UseTransactions,
} from '../store/transactions/types';
import { Config } from '../hooks/useConfigVariables';

const mintAndLock = async (
  config: Config,
  transactionActions: UseTransactions,
  signer: Signer,
  provider: providers.Web3Provider,
  amount: BigNumber,
  callback: (args: CallbackArgs) => void
) => {
  const { aludelAddress, crucibleFactoryAddress, transmuterAddress } = config;
  const { addTransactionToStore, updateTransaction } = transactionActions;

  const walletAddress = await signer.getAddress();
  // fetch contracts
  const aludel = new ethers.Contract(aludelAddress, aludelAbi, signer);
  //const aludel = await ethers.getContractAt('Aludel', args.aludel, signer)
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

  // declare config
  const salt = randomBytes(32);
  const deadline = (await provider.getBlock('latest')).timestamp + 60 * 60 * 24;

  let txn;

  try {
    addTransactionToStore(TxnType.mint);
    // validate balances
    if ((await stakingToken.balanceOf(walletAddress)).lt(amount)) {
      throw new Error('Not enough balance');
    }

    // craft permission
    const crucible = new ethers.Contract(
      await transmuter.predictDeterministicAddress(
        await crucibleFactory.getTemplate(),
        salt,
        crucibleFactory.address
      ),
      crucibleAbi,
      signer
    );

    callback({
      type: EVENT.PENDING_SIGNATURE,
      step: 1,
      totalSteps: 2,
    });

    const permit = await signPermitEIP2612(
      signer,
      walletAddress,
      stakingToken,
      transmuter.address,
      amount,
      deadline
    );

    await wait(300);

    callback({
      type: EVENT.PENDING_SIGNATURE,
      step: 2,
      totalSteps: 2,
    });

    const permission = await signPermission(
      'Lock',
      crucible,
      signer,
      aludel.address,
      stakingToken.address,
      amount,
      0
    );

    callback({
      type: EVENT.PENDING_APPROVAL,
    });

    txn = await transmuter.mintCruciblePermitAndStake(
      aludel.address,
      crucibleFactory.address,
      walletAddress,
      salt,
      permit,
      permission
    );

    updateTransaction({ ...txn, status: TxnStatus.Pending });

    callback({
      type: EVENT.TX_CONFIRMED,
      message: 'success',
      txHash: txn.hash,
    });

    await txn.wait(1);

    updateTransaction({ ...txn, status: TxnStatus.Mined });
    callback({
      type: EVENT.TX_MINED,
    });
  } catch (e) {
    updateTransaction({ ...txn, status: TxnStatus.Failed });
    callback({
      type: EVENT.TX_ERROR,
      message: e.message,
      code: e.code,
    });
    console.log(e);
  }
};

export default mintAndLock;
