import React from 'react';
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatArrow,
  StatGroup,
  Spinner,
  StatHelpText,
} from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/tooltip';
import { Crucible } from '../../../context/crucibles/crucibles';

type Props = {
  crucible: Crucible;
};
const LpPerformance: React.FC<Props> = ({ crucible }) => {
  if (!crucible) return <Spinner width={24} height={24} />;
  const netMistGainLoss =
    Number(crucible.mistValue) - Number(crucible.initialMistInLP);
  const netWethGainLoss =
    Number(crucible.wethValue) - Number(crucible.initialEthInLP);

  const netMistGainLossUSD = netMistGainLoss * crucible.mistPrice!;
  const netWethGainLossUSD = netWethGainLoss * crucible.wethPrice!;
  const cummulativeGainLossUSD =
    Number(netMistGainLossUSD) + Number(netWethGainLossUSD);

  return (
    <Box p={4} bg='white' color='gray.800' borderRadius='xl'>
      <StatGroup mt={4} justifyContent='space-between'>
        <Tooltip
          label='Current MIST deposited in your staked liquidity pool tokens'
          placement='top'
          hasArrow={true}
        >
          <Stat
            backgroundColor='whitesmoke'
            borderRadius='xl'
            height='6.5rem'
            margin='.25rem'
            padding='.25rem'
          >
            <StatLabel>MIST Balance</StatLabel>
            <StatNumber>
              {`${Number(crucible?.mistValue).toFixed(3)}`}
            </StatNumber>
            {!!netMistGainLoss && (
              <StatHelpText>
                <StatArrow
                  type={netMistGainLoss > 0 ? 'increase' : 'decrease'}
                />
                {`${netMistGainLoss.toFixed(
                  3
                )} · ($${netMistGainLossUSD.toFixed(0)})`}
              </StatHelpText>
            )}
          </Stat>
        </Tooltip>
        <Tooltip
          label='Current ETH deposited in your staked liquidity pool tokens'
          placement='top'
          hasArrow={true}
        >
          <Stat
            backgroundColor='whitesmoke'
            borderRadius='xl'
            height='6.5rem'
            margin='.25rem'
            padding='.25rem'
          >
            <StatLabel>ETH Balance</StatLabel>
            <StatNumber>
              {`${Number(crucible?.wethValue).toFixed(3)}`}
            </StatNumber>
            {!!netWethGainLoss && (
              <StatHelpText>
                <StatArrow
                  type={netWethGainLoss > 0 ? 'increase' : 'decrease'}
                />
                {`${netWethGainLoss.toFixed(
                  3
                )} Ξ  ($${netWethGainLossUSD.toFixed(0)})`}
              </StatHelpText>
            )}
          </Stat>
        </Tooltip>
        <Tooltip
          label='Your percent of the Uniswap ETH/MIST liquidity pool'
          placement='top'
          hasArrow={true}
        >
          <Stat
            backgroundColor='whitesmoke'
            borderRadius='xl'
            height='6.5rem'
            margin='.25rem'
            padding='.25rem'
          >
            <StatLabel>% of Pool</StatLabel>
            <StatNumber>
              {`${(
                (Number(crucible.cleanBalance) /
                  Number(crucible.totalLpSupply)) *
                100
              ).toFixed(4)}%`}
            </StatNumber>
          </Stat>
        </Tooltip>
        {!!cummulativeGainLossUSD && (
          <Tooltip
            label='Impermanment gains or loss (USD) due to arbitrage and fees on the Uniswap liquidity pool.'
            placement='top'
            hasArrow={true}
          >
            <Stat
              backgroundColor='whitesmoke'
              borderRadius='xl'
              height='6.5rem'
              margin='.25rem'
              padding='.25rem'
            >
              <StatLabel>
                Net LP {cummulativeGainLossUSD > 0 ? 'Gain' : 'Loss'}
              </StatLabel>
              <StatNumber>{`$${cummulativeGainLossUSD.toFixed(0)}`}</StatNumber>
            </Stat>
          </Tooltip>
        )}
      </StatGroup>
    </Box>
  );
};

export default LpPerformance;
