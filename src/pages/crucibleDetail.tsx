import React, { FC, useMemo } from 'react';
import { Center, Flex } from '@chakra-ui/layout';
import { useParams, Redirect } from 'react-router';
import { Crucible, useCrucibles } from '../context/crucibles/crucibles';
import CrucibleDetailCard from '../components/crucible/detail/crucibleDetailCard';
import { Spinner } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';

const CrucibleDetail: FC = () => {
  const { crucibleId } = useParams<{ crucibleId: string }>();
  const { isLoading: isCrucibleLoading, crucibles } = useCrucibles();
  const selectedCrucible: Crucible | undefined = useMemo(() => {
    return crucibles?.find(({ id }) => id === crucibleId);
  }, [crucibles, crucibleId]);
  const { account } = useWeb3React();

  const renderContent = useMemo(() => {
    if (!account) {
      return (
        <Flex justifyContent='center' alignItems='center' flexGrow={1}>
          You must connect your wallet to view your crucible details
        </Flex>
      );
    }

    if (isCrucibleLoading) {
      return (
        <Flex justifyContent='center' alignItems='center' flexGrow={1}>
          <Spinner />
        </Flex>
      );
    }

    if (!selectedCrucible) {
      return <Redirect to='/' />;
    }

    return <CrucibleDetailCard crucible={selectedCrucible} />;
  }, [isCrucibleLoading, account, selectedCrucible]);

  return (
    <Center>
      <Flex
        p={10}
        bg='purple.800'
        flexDir='column'
        mt={[32, 32, 40]}
        textAlign='center'
        width={['100%', '100%', 640]}
        borderRadius='3xl'
        boxShadow='xl'
        minH='400px'
      >
        {renderContent}
      </Flex>
    </Center>
  );
};

export default CrucibleDetail;
