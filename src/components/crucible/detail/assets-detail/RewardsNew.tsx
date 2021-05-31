import { Box, Stack } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
import { useWeb3React } from '@web3-react/core';
import {
  useRewardPrograms,
  RewardProgramName,
} from '../../../../store/rewardPrograms';

const RewardsNew = () => {
  const { chainId = 1 } = useWeb3React();
  const {
    currentRewardProgram,
    rewardPrograms,
    setCurrentRewardProgram,
  } = useRewardPrograms();

  return (
    <Box p={[4, 8]} bg='white' color='gray.800' borderRadius='xl'>
      <Stack>
        <Select
          onChange={(e) =>
            setCurrentRewardProgram(
              chainId,
              e.target.value as RewardProgramName
            )
          }
        >
          {rewardPrograms[chainId].map((p) => (
            <option value={p.name}>{p.name}</option>
          ))}
        </Select>
        <div>{JSON.stringify(currentRewardProgram)}</div>
      </Stack>
    </Box>
  );
};

export default RewardsNew;
