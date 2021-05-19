// TEST PAGE
import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useCrucibles } from '../../../store/crucibles';

const Assets = () => {
  const { library } = useWeb3React();
  const {
    crucibles,
    cruciblesLoading,
    getOwnedCrucibles,
    resetCrucibles,
  } = useCrucibles();

  useEffect(() => {
    getOwnedCrucibles(library.getSigner(), library);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (cruciblesLoading) {
    return <div>Loading...</div>;
  }

  if (crucibles.length === 0) {
    return <div>No crucibles</div>;
  }

  return (
    <div>
      <div>
        {crucibles.map((crucible) => (
          <div>
            <div>{crucible.id}</div>
            {crucible.containedAssets.map((asset) => (
              <div>{asset.tokenName}</div>
            ))}
          </div>
        ))}
      </div>
      <div>
        <button onClick={() => resetCrucibles()}>Reset crucibles</button>
      </div>
      <div>
        <button onClick={() => getOwnedCrucibles(library.getSigner(), library)}>
          Refresh crucibles
        </button>
      </div>
    </div>
  );
};

export default Assets;
