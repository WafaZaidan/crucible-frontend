import { LightMode } from '@chakra-ui/color-mode';
import { Stack } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/skeleton';

const AssetsLoadingSkeleton = () => {
  return (
    <LightMode>
      <Stack p={6} borderRadius='xl' bg='white' spacing={4}>
        <Skeleton height='22px' />
        <Skeleton height='22px' />
        <Skeleton height='22px' />
        <Skeleton height='22px' />
      </Stack>
    </LightMode>
  );
};

export default AssetsLoadingSkeleton;
