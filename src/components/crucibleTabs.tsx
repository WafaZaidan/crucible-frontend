import Rewards from './rewards';
import { Box } from '@chakra-ui/layout';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';

const CrucibleTabs = () => {
  const tabProps = {
    borderRadius: 'lg',
    fontWeight: 'bold',
    fontSize: ['0.7rem', 'sm'],
    _selected: { color: 'gray.800', bg: 'cyan.500' },
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
          <TabPanel px={0}>
            <Rewards />
          </TabPanel>
          <TabPanel px={0}>LP Perf</TabPanel>
          <TabPanel px={0}>Network</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CrucibleTabs;
