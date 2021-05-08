import React, { FC } from 'react';
import { Box } from '@chakra-ui/layout';
import useConfigVariables from '../../hooks/useConfigVariables';
import { useTokens } from '../../context/tokens';
import MintingFormControl from './mintingFormControl';
import MissingIngredients from './missingIngredients';
import MintingHelper from './mintingHelper';

const MintingForm: FC = () => {
  const { tokens } = useTokens();
  const { lpTokenAddress } = useConfigVariables();

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
