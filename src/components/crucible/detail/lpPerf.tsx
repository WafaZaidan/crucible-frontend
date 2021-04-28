import React, { FC } from 'react';
import { Box, Spinner, StatGroup } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/tooltip';
import { Crucible } from '../../../context/crucibles/crucibles';
import StatCard from '../../shared/StatCard';

type Props = {
  crucible: Crucible;
};
const LpPerformance: FC<Props> = ({ crucible }) => {
  // TODO - this isn't a great way to handle crucible loading state because we can't use hooks in a conditional render
  if (!crucible) return <Spinner width={24} height={24} />;

  const netMistGainLoss =
    Number(crucible.mistValue) - Number(crucible.initialMistInLP);
  const netWethGainLoss =
    Number(crucible.wethValue) - Number(crucible.initialEthInLP);
  const netMistGainLossUSD = netMistGainLoss * crucible.mistPrice!;
  const netWethGainLossUSD = netWethGainLoss * crucible.wethPrice!;
  const cummulativeGainLossUSD =
    Number(netMistGainLossUSD) + Number(netWethGainLossUSD);

  const mistSubLabel = !!netMistGainLoss
    ? `${netMistGainLoss.toFixed(3)} · ($${netMistGainLossUSD.toFixed(0)})`
    : undefined;

  const ethSubLabel = !!netMistGainLoss
    ? `${netWethGainLoss.toFixed(3)} Ξ ($${netWethGainLossUSD.toFixed(0)})`
    : undefined;

  return (
    <Box p={4} bg='white' color='gray.800' borderRadius='xl'>
      <StatGroup mt={4} justifyContent='space-between'>
        <Tooltip
          label='Current MIST deposited in your staked liquidity pool tokens'
          placement='top'
          hasArrow={true}
        >
          <StatCard
            title='MIST Balance'
            label={`${Number(crucible?.mistValue).toFixed(3)}`}
            subLabel={mistSubLabel}
            arrowOnSubLabel
            arrowType={netMistGainLoss > 0 ? 'increase' : 'decrease'}
          />
        </Tooltip>
        <Tooltip
          label='Current ETH deposited in your staked liquidity pool tokens'
          placement='top'
          hasArrow={true}
        >
          <StatCard
            title='ETH Balance'
            label={`${Number(crucible?.wethValue).toFixed(3)}`}
            subLabel={ethSubLabel}
            arrowOnSubLabel
            arrowType={netWethGainLoss > 0 ? 'increase' : 'decrease'}
          />
        </Tooltip>
        <Tooltip
          label='Your percent of the Uniswap ETH/MIST liquidity pool'
          placement='top'
          hasArrow={true}
        >
          <StatCard
            title='Percent of Pool'
            label={`${(
              (Number(crucible.cleanBalance) / Number(crucible.totalLpSupply)) *
              100
            ).toFixed(4)}%`}
          />
        </Tooltip>
        {!!cummulativeGainLossUSD && (
          <Tooltip
            label='Impermanment gains or loss (USD) due to arbitrage and fees on the Uniswap liquidity pool.'
            placement='top'
            hasArrow={true}
          >
            <StatCard
              title={`Net LP ${cummulativeGainLossUSD > 0 ? 'Gain' : 'Loss'}`}
              label={`$${cummulativeGainLossUSD.toFixed(0)}`}
            />
          </Tooltip>
        )}
      </StatGroup>
    </Box>
  );
};

export default LpPerformance;
