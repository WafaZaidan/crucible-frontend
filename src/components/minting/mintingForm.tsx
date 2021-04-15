import { Box } from '@chakra-ui/layout';
import { config } from '../../config/variables';
import { useWeb3 } from '../../context/web3';
import MintingFormControl from './mintingFormControl';
import MissingIngredients from './missingIngredients';
import MintingHelper from './mintingHelper';

const MintingForm = () => {
  const { tokens } = useWeb3();
  const { lpTokenAddress } = config;

  return (
    <Box>
      {!tokens[lpTokenAddress].balance ? (
        <MissingIngredients />
      ) : (
        <Box>
          <MintingHelper />
          <MintingFormControl />
        </Box>
      )}
    </Box>
  );
};

export default MintingForm;
