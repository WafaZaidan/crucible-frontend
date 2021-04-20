import { VStack, Center } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { useEffect } from 'react';
import { useCrucibles } from '../../context/crucibles';
import { useWeb3 } from '../../context/web3';
import CrucibleCard from './crucibleCard';
import MissingCrucibles from './missingCrucibles';

const CruciblesListView = () => {
  const {
    crucibles,
    reloadCrucibles,
    isLoading,
    isRewardsLoading,
  } = useCrucibles();
  const { tokens } = useWeb3();

  useEffect(() => {
    reloadCrucibles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  if (isLoading) {
    return (
      <Center my={8}>
        <Spinner width={24} height={24} />
      </Center>
    );
  }
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
