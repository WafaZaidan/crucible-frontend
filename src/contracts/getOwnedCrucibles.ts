import { BigNumber, BigNumberish, ethers } from 'ethers';
import { crucibleAbi } from '../abi/crucibleAbi';
import { crucibleFactoryAbi } from '../abi/crucibleFactoryAbi';
import { _abi } from '../interfaces/Erc20DetailedFactory';
import { aludelAbi } from '../abi/aludelAbi';

function convertTokenIdToAddress(tokenId: BigNumberish) {
  let id = BigNumber.from(tokenId).toHexString();
  if (id.length < 42) {
    id = '0x' + id.slice(2).padStart(40, '0');
  }
  return id;
}

function getCrucibleIdsFromEvents(events: ethers.Event[]) {
  const handledIds = new Set();
  const crucibleIds = [];
  for (const event of events) {
    if (!event.args || !event.args.tokenId) {
      console.error(`Missing tokenId arg`, event);
      continue;
    }
    const id = convertTokenIdToAddress(event.args.tokenId);
    if (!handledIds.has(id)) {
      handledIds.add(id);
      crucibleIds.push({ id, event });
    }
  }
  return crucibleIds;
}

async function getOwnedCrucibles(
  crucibleFactoryAddress: string,
  lpTokenAddress: string,
  aludelAddress: string,
  signer: any,
  provider: any
) {
  const address = await signer.getAddress();
  const token = new ethers.Contract(lpTokenAddress, _abi, signer);
  const crucibleFactory = new ethers.Contract(
    crucibleFactoryAddress,
    crucibleFactoryAbi,
    signer
  );
  const filter = crucibleFactory.filters.Transfer(null, address);
  const crucibleEvents = await crucibleFactory.queryFilter(filter, 0, 'latest');
  const ids = getCrucibleIdsFromEvents(crucibleEvents);

  // const aludelInterface = new ethers.utils.Interface(aludelAbi);
  // const logs = await provider.getLogs({
  //   address: aludelAddress,
  //   fromBlock: 0,
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
  const crucibles = await Promise.all(
    ids.map(async ({ id, event }) => {
      const aludel = new ethers.Contract(aludelAddress, aludelAbi, signer);
      const crucible = new ethers.Contract(id, crucibleAbi, signer);
      const ownerPromise = crucibleFactory.ownerOf(id);
      const balancePromise = token.balanceOf(crucible.address);
      const lockedBalancePromise = crucible.getBalanceLocked(lpTokenAddress);
      const vaultDataPromise = aludel.getVaultData(id);
      // TODO get the block in which the crucible was actually minted, not the block it was transferred to the latest owner
      const blockPromise = provider.getBlock(event.blockNumber);

      const [
        owner,
        balance,
        lockedBalance,
        vaultData,
        block,
      ] = await Promise.all([
        ownerPromise,
        balancePromise,
        lockedBalancePromise,
        vaultDataPromise,
        blockPromise,
      ]);
      const [, stakes] = vaultData;

      return {
        id,
        balance,
        lockedBalance,
        unlockedBalance: balance.sub(lockedBalance),
        owner,
        mintTimestamp: block.timestamp,
        stakes,
      };
    })
  );

  // There is the possibility that a Crucible has been transferred to an account which has transferred it on again to another
  // The initial filter doesn't distinguish this, so we filter again to remove Crucibles who report an owner different to the desired account address
  return crucibles.filter((crucible) => {
    return crucible.owner === address;
  });
}

// TODO: Placeholder
export const getOwnedCruciblesNew = async (
  crucibleFactoryAddress: string,
  signer: any,
  provider: any
) => {
  const address = await signer.getAddress();
  const crucibleFactory = new ethers.Contract(
    crucibleFactoryAddress,
    crucibleFactoryAbi,
    signer
  );

  const filter = crucibleFactory.filters.Transfer(null, address);
  const crucibleEvents = await crucibleFactory.queryFilter(filter, 0, 'latest');
  const ids = getCrucibleIdsFromEvents(crucibleEvents);

  const crucibles = await Promise.all(
    ids.map(async ({ id, event }) => {
      const ownerPromise = crucibleFactory.ownerOf(id);
      // TODO get the block in which the crucible was actually minted, not the block it was transferred to the latest owner
      const blockPromise = provider.getBlock(event.blockNumber);

      const [owner, block] = await Promise.all([ownerPromise, blockPromise]);

      return {
        id,
        owner,
        mintTimestamp: block.timestamp,
      };
    })
  );

  return crucibles.filter((crucible) => {
    return crucible.owner === address;
  });
};

export default getOwnedCrucibles;
