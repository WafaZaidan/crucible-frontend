import React, { FC } from 'react';
import { HStack, VStack } from '@chakra-ui/layout';
import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';

interface StatCardProps {
  title?: string | JSX.Element;
  label?: string | JSX.Element;
  subLabel?: string | JSX.Element;
  arrowOnSubLabel?: boolean;
  arrowType?: 'increase' | 'decrease';
}

const StatCard: FC<StatCardProps> = React.forwardRef(
  (
    { title, label, subLabel, arrowOnSubLabel, arrowType = 'increase' },
    ref
  ) => {
    return (
      <Stat
        textAlign='center'
        backgroundColor='whitesmoke'
        borderRadius='xl'
        margin='.1rem'
        padding='.5rem'
        style={{ alignSelf: 'stretch' }} // to match height of siblings
      >
        <VStack justifyContent='center'>
          {title && (
            <StatLabel paddingBottom='.2rem' fontWeight='bold'>
              {title}
            </StatLabel>
          )}
          {label && <StatNumber fontSize='md'>{label}</StatNumber>}
          <HStack>
            {subLabel && (
              <StatHelpText fontSize='md'>
                {arrowOnSubLabel && <StatArrow type={arrowType} />}
                {subLabel}
              </StatHelpText>
            )}
          </HStack>
        </VStack>
      </Stat>
    );
  }
);

export default StatCard;
