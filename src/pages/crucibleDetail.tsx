import { Center, Flex } from '@chakra-ui/layout';
import { useLocation } from 'react-router';
import { Crucible } from '../context/crucibles/crucibles';
import CrucibleDetailCard from '../components/crucible/detail/crucibleDetailCard';

type LocationState = {
  crucible: Crucible;
};

const CrucibleDetail = () => {
  const {
    state: { crucible },
  } = useLocation<LocationState>();
  return (
    <Center>
      <Flex
        p={8}
        bg='gray.800'
        flexDir='column'
        mt={[32, 32, 40]}
        textAlign='center'
        width={['100%', '100%', 640]}
        borderRadius='3xl'
        boxShadow='xl'
        minH='400px'
      >
        <CrucibleDetailCard crucible={crucible} />
      </Flex>
    </Center>
  );
};

export default CrucibleDetail;
