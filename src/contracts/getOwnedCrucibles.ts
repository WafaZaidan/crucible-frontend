import { ethers } from 'ethers';
import { crucibleAbi } from '../abi/crucibleAbi';
import { crucibleFactoryAbi } from '../abi/crucibleFactoryAbi';
import { _abi } from '../interfaces/Erc20DetailedFactory';
import { config } from '../config/variables';
import { aludelAbi } from '../abi/aludelAbi';
import { formatUnits } from '@ethersproject/units';
import { Stake } from '../context/crucibles/crucibles';

export async function getOwnedCrucibles(signer: any, provider: any) {
  const { crucibleFactoryAddress, lpTokenAddress, aludelAddress } = config;
  const aludelCreationBlockHeight = 11881242;
  const address = await signer.getAddress();
  const token = new ethers.Contract(lpTokenAddress, _abi, signer);
  const crucibleFactory = new ethers.Contract(
    crucibleFactoryAddress,
    crucibleFactoryAbi,
    signer
  );
  const filter = crucibleFactory.filters.Transfer(null, address);
  const crucibleEvents = await crucibleFactory.queryFilter(
    filter,
    aludelCreationBlockHeight,
    'latest'
  );

  // const aludelInterface = new ethers.utils.Interface(aludelAbi);
  // const logs = await provider.getLogs({
  //   address: aludelAddress,
  //   fromBlock: aludelCreationBlockHeight,
  // });
  // const decodedEvents = logs.map((log: any) => {
  //   if (
  //     log.topics[0] ===
  //     '0xcdaeff380dcd7e8d5a525f40e660d1f8c3cb93e4423e426cc25a3390fd79d4c7'
  //   ) {
  //     return aludelInterface.decodeEventLog('Staked', log.data);
  //   }
  //   return;
  // });
  const crucibles = crucibleEvents.map(async (data) => {
    let id = (data.args!.tokenId as ethers.BigNumber).toHexString();
    if (id.length < 42) {
      id = '0x' + id.slice(2).padStart(40, '0');
    }
    const aludel = new ethers.Contract(aludelAddress, aludelAbi, signer);
    const crucible = new ethers.Contract(id, crucibleAbi, signer);
    const owner = crucibleFactory.ownerOf(id);
    const balance = token.balanceOf(crucible.address);
    const lockedBalance = crucible.getBalanceLocked(lpTokenAddress);
    const [totalStake, stakes] = await aludel.getVaultData(id);
    let parsedStakes = stakes.map((stake: Stake) => {
      return {
        amount: Number(formatUnits(stake.amount)).toFixed(3),
        timestamp: stake.timestamp * 1000,
      };
    });

    return {
      id,
      balance: await balance,
      lockedBalance: await lockedBalance,
      owner: await owner,
      mintTimestamp:
        (await provider.getBlock(data.blockNumber))?.timestamp * 1000,
      cleanBalance: formatUnits(await balance),
      cleanLockedBalance: formatUnits(await lockedBalance),
      stakes: parsedStakes,
    };
  });

  return (await Promise.all(crucibles)).filter(
    (crucible, index, resolvedCrucibles) =>
      crucible.owner === address &&
      resolvedCrucibles.slice(0, index).find((c) => c.id === crucible.id) ===
        undefined
  );
}
