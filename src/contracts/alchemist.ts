import { BigNumber, ethers, providers, Signer } from 'ethers';
import { randomBytes } from 'ethers/lib/utils';
import { signPermission, signPermitEIP2612 } from './utils';
import { aludelAbi } from '../abi/aludelAbi';
import { transmuterAbi } from '../abi/transmuterAbi';
import { crucibleFactoryAbi } from '../abi/crucibleFactoryAbi';
import { crucibleAbi } from '../abi/crucibleAbi';
import { config } from '../config/variables';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { CallbackArgs, EVENT } from '../hooks/useContract';

const { aludelAddress, crucibleFactoryAddress, transmuterAddress } = config;

export async function mintAndLock(
  signer: Signer,
  provider: providers.Web3Provider,
  amount: BigNumber,
  callback: (args: CallbackArgs) => void
) {
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

  try {
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

    console.log('Sign Permit');

    const permit = await signPermitEIP2612(
      signer,
      walletAddress,
      stakingToken,
      transmuter.address,
      amount,
      deadline
    );

    callback({
      type: EVENT.PENDING_SIGNATURE,
      step: 2,
      totalSteps: 2,
    });

    console.log('Sign Lock');

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

    console.log('Mint, Deposit, Stake');

    const tx = await transmuter.mintCruciblePermitAndStake(
      aludel.address,
      crucibleFactory.address,
      walletAddress,
      salt,
      permit,
      permission
    );

    callback({
      type: EVENT.TX_CONFIRMED,
      message: 'success',
      txHash: tx.hash,
    });

    console.log('  in', tx.hash);
  } catch (e) {
    callback({
      type: EVENT.TX_ERROR,
      message: e.message,
      code: e.code,
    });
    console.log(e);
  }
}
