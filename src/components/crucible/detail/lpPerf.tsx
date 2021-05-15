import React, { FC } from 'react';
import { Box, Spinner, StatGroup } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/tooltip';
import { Crucible } from '../../../context/crucibles/crucibles';
import StatCard from '../../shared/StatCard';
import formatNumber from '../../../utils/formatNumber';
import getMultiplier from '../../../utils/getMultiplier';
import { BigNumber } from 'ethers';

type SubLabelProps = {
  netGainLoss: BigNumber;
  netGainLossUSD: BigNumber;
  tokenSymbol: string;
};
const SubLabel: FC<SubLabelProps> = ({
  netGainLoss,
  netGainLossUSD,
  tokenSymbol,
}) => {
  return (
    <>
      {`${formatNumber.token(netGainLoss)} ${tokenSymbol}`}
      <br />
      {`(${formatNumber.currency(netGainLossUSD)})`}
    </>
  );
};

type Props = {
  crucible: Crucible;
};
const LpPerformance: FC<Props> = ({ crucible }) => {
  // TODO - this isn't a great way to handle crucible loading state because we can't use hooks in a conditional render
  if (!crucible) return <Spinner width={24} height={24} />;

  let netMistGainLoss;
  if (crucible.currentMistInLp && crucible.initialMistInLP) {
    netMistGainLoss = crucible.currentMistInLp.sub(crucible.initialMistInLP);
  }
  let netWethGainLoss;
  if (crucible.currentWethInLp && crucible.initialEthInLP) {
    netWethGainLoss = crucible.currentWethInLp.sub(crucible.initialEthInLP);
  }
  let netMistGainLossUSD;
  if (netMistGainLoss && crucible.mistPrice) {
    netMistGainLossUSD = netMistGainLoss
      .mul(crucible.mistPrice)
      .div(getMultiplier());
  }
  let netWethGainLossUSD;
  if (netWethGainLoss && crucible.wethPrice) {
    netWethGainLossUSD = netWethGainLoss
      .mul(crucible.wethPrice)
      .div(getMultiplier());
  }
  let cumulativeGainLossUSD;
  if (netMistGainLossUSD && netWethGainLossUSD) {
    cumulativeGainLossUSD = netMistGainLossUSD.add(netWethGainLossUSD);
  }
  let percentOfPool = '-';
  if (crucible.totalLpSupply) {
    percentOfPool = formatNumber.percentLong(
      crucible.balance.mul(getMultiplier()).div(crucible.totalLpSupply)
    );
  }

  let mistSubLabel;
  if (netMistGainLoss && netMistGainLossUSD) {
    mistSubLabel = (
      <SubLabel
        netGainLoss={netMistGainLoss}
        netGainLossUSD={netMistGainLossUSD}
        tokenSymbol={'⚗'}
      />
    );
  }

  let ethSubLabel;
  if (netWethGainLoss && netWethGainLossUSD) {
    ethSubLabel = (
      <SubLabel
        netGainLoss={netWethGainLoss}
        netGainLossUSD={netWethGainLossUSD}
        tokenSymbol={'Ξ'}
      />
    );
  }

  return (
    <Box p={4} bg='white' color='gray.800' borderRadius='xl'>
      <StatGroup gridGap={4}>
        <Tooltip
          label='Current MIST deposited in your subscribed liquidity pool tokens'
          placement='top'
          hasArrow={true}
        >
          <StatCard
            title='MIST Balance'
            label={
              crucible.currentMistInLp
                ? formatNumber.token(crucible.currentMistInLp)
                : '-'
            }
            subLabel={mistSubLabel}
            arrowOnSubLabel={!!netMistGainLoss && !netMistGainLoss.isZero()}
            arrowType={
              netMistGainLoss && netMistGainLoss.gte(0)
                ? 'increase'
                : 'decrease'
            }
          />
        </Tooltip>
        <Tooltip
          label='Current ETH deposited in your subscribed liquidity pool tokens'
          placement='top'
          hasArrow={true}
        >
          <StatCard
            title='ETH Balance'
            label={
              crucible.currentWethInLp
                ? formatNumber.token(crucible.currentWethInLp)
                : '-'
            }
            subLabel={ethSubLabel}
            arrowOnSubLabel={!!netWethGainLoss && !netWethGainLoss.isZero()}
            arrowType={
              netWethGainLoss && netWethGainLoss.gte(0)
                ? 'increase'
                : 'decrease'
            }
          />
        </Tooltip>
        <Tooltip
          label='Your percent of the Uniswap ETH/MIST liquidity pool'
          placement='top'
          hasArrow={true}
        >
          <StatCard title='Percent of Pool' label={percentOfPool} />
        </Tooltip>
        {cumulativeGainLossUSD && (
          <Tooltip
            label='Impermanent gains or loss (USD) due to arbitrage and fees on the Uniswap liquidity pool.'
            placement='top'
            hasArrow={true}
          >
            <StatCard
              title={`Net LP ${cumulativeGainLossUSD.gte(0) ? 'Gain' : 'Loss'}`}
              label={formatNumber.currency(cumulativeGainLossUSD)}
            />
          </Tooltip>
        )}
      </StatGroup>
    </Box>
  );
};

export default LpPerformance;
