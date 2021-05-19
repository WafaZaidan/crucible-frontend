import React, { FC } from 'react';
import Rewards from './rewards';
import LpPerformance from './lpPerf';
import Assets from './assets';
import NetworkStats from './networkStats';
import { Box } from '@chakra-ui/layout';
import { Crucible } from '../../../context/crucibles';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';

type Props = {
  crucible: Crucible;
};
const CrucibleTabs: FC<Props> = ({ crucible }) => {
  const tabProps = {
    borderRadius: 'lg',
    fontWeight: 'bold',
    fontSize: ['0.7rem', 'sm'],
    _selected: { color: 'gray.800', bg: 'cyan.400' },
  };

  return (
    <Box position='relative'>
      <Tabs align='center' noOfLines={1} isFitted>
        <TabList bg='gray.700' borderRadius='xl' border='none' p={2}>
          <Tab {...tabProps}>Rewards</Tab>
          <Tab {...tabProps}>LP Performance</Tab>
          <Tab {...tabProps}>Network</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0} pb={0}>
            {/* Placeholder */}
            <Assets />
          </TabPanel>
          <TabPanel px={0} pb={0}>
            <Rewards crucible={crucible} />
          </TabPanel>
          <TabPanel px={0} pb={0}>
            <LpPerformance crucible={crucible} />
          </TabPanel>
          <TabPanel px={0} pb={0}>
            <NetworkStats crucible={crucible} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CrucibleTabs;
