import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { crucibleAbi } from '../abi/crucibleAbi';
import { ContainedAsset, getContainedAssets } from '../helpers/crucible';
import { _abi } from '../interfaces/Erc20DetailedFactory';
import { useConfig } from '../store/config';

type Props = {
  address: string;
  isCrucible?: boolean;
};

export function useContainedAssets({ address, isCrucible = false }: Props) {
  const { chainId = 1, library } = useWeb3React();
  const { etherscanApiKey } = useConfig().config[chainId];
  const [selectedAsset, setSelectedAsset] = useState<ContainedAsset>();
  const [containedAssets, setContainedAssets] = useState<ContainedAsset[]>([]);
  const [containedAssetsLoading, setContainedAssetsLoading] = useState(false);
  const [error, setError] = useState('');

  const withUnlockedAmounts = async (assets: ContainedAsset[]) => {
    const signer = library.getSigner();
    const crucible = new ethers.Contract(address, crucibleAbi, signer);

    return Promise.all(
      assets.map(async (asset) => {
        const token = new ethers.Contract(asset.contractAddress, _abi, signer);
        const tokenBalnce = await token.balanceOf(address);
        const lockedBalance = await crucible.getBalanceLocked(
          asset.contractAddress
        );
        const unlockedBalance = tokenBalnce.sub(lockedBalance);
        return {
          ...asset,
          value: unlockedBalance,
        };
      })
    );
  };

  // TODO: Add caching
  const getContainedAssetsInCrucible = async () => {
    try {
      const assets = await getContainedAssets(
        address,
        chainId,
        etherscanApiKey
      );
      const updatedAssets = isCrucible
        ? await withUnlockedAmounts(assets)
        : assets;
      setContainedAssets(updatedAssets);
      setSelectedAsset(updatedAssets[0]);
    } catch (e) {
      setError(e.message || 'Failed to get contained assets');
    } finally {
      setContainedAssetsLoading(false);
    }
  };

  const handleSetSelectedAsset = (address: string) => {
    setSelectedAsset(
      containedAssets.find((asset) => asset.contractAddress === address) ||
        containedAssets[0]
    );
  };

  useEffect(() => {
    setContainedAssetsLoading(true);
    getContainedAssetsInCrucible();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    selectedAsset,
    handleSetSelectedAsset,
    containedAssets,
    containedAssetsLoading,
    error,
  };
}
