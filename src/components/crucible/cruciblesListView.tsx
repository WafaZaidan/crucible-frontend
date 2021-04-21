import { VStack } from '@chakra-ui/layout';
import { useEffect } from 'react';
import { useCrucibles } from '../../context/crucibles';
import { useWeb3 } from '../../context/web3';
import CrucibleCard from './crucibleCard';
import MissingCrucibles from './missingCrucibles';

const CruciblesListView = () => {
  const { crucibles, reloadCrucibles, isRewardsLoading } = useCrucibles();
  const { tokens } = useWeb3();

  useEffect(() => {
    reloadCrucibles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  if (crucibles && crucibles?.length === 0) {
    return <MissingCrucibles />;
  }

  return (
    <VStack align='stretch' spacing={4}>
      {crucibles &&
        crucibles.map((crucible) => {
          return (
            <CrucibleCard
              key={crucible.id}
              crucible={crucible}
              isRewardsLoading={isRewardsLoading}
              isExpanded={crucibles.length === 1}
            />
          );
        })}
    </VStack>
  );
};

export default CruciblesListView;
