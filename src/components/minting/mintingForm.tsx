import React, { FC } from 'react';
import { Box } from '@chakra-ui/layout';
import { config } from '../../config/variables';
import { useTokens } from '../../context/tokens';
import MintingFormControl from './mintingFormControl';
import MissingIngredients from './missingIngredients';
import MintingHelper from './mintingHelper';

const MintingForm: FC = () => {
  const { tokens } = useTokens();
  const { lpTokenAddress } = config;

  return (
    <Box>
      {!tokens[lpTokenAddress]?.balance ? (
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
