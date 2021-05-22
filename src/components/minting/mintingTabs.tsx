import React, { FC, useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/layout';
import { useCrucibles } from '../../context/crucibles';
import { Spinner } from '@chakra-ui/spinner';
import { useFeatureFlag } from '../../store/featureFlag';
import CruciblesListView from '../crucible/cruciblesListView';
import MintingForm from './mintingForm';
import CruciblesListViewNew from '../crucible/crucibleListViewNew';

const MintingTabs: FC = () => {
  const { crucibles, isLoading } = useCrucibles();
  const { featureFlag } = useFeatureFlag();
  const [tabIndex, setTabIndex] = useState(
    featureFlag.enableMultipleRewardPrograms ? 1 : 0
  );
  const crucibleCount = crucibles?.length || 0;
  useEffect(() => {
    if (!featureFlag.enableMultipleRewardPrograms && crucibleCount > 0) {
      setTabIndex(1);
    }
  }, [crucibleCount]);

  const tabProps = {
    borderRadius: 'lg',
    fontWeight: 'bold',
    fontSize: ['14px', '16px'],
    _selected: { color: 'purple.800', bg: 'cyan.400' },
  };

  if (isLoading && !featureFlag.enableMultipleRewardPrograms) {
    return (
      <Flex justifyContent='center' alignItems='center' flexGrow={1}>
        <VStack>
          <Spinner />
          <br />
          <Text>Fetching Crucible information.</Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box position='relative'>
      <Heading top={['-80px', '-120px']} position='absolute' width='100%'>
        {tabIndex === 0 ? 'Mint a Crucible' : 'Crucible Collection'}
      </Heading>
      <Tabs
        index={tabIndex}
        isFitted
        defaultIndex={tabIndex}
        onChange={(index) => setTabIndex(index)}
      >
        <TabList bg='gray.700' borderRadius='xl' border='none' p={2}>
          <Tab {...tabProps}>Mint</Tab>
          <Tab {...tabProps}>Your Crucibles</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0} pb={0}>
            <MintingForm />
          </TabPanel>
          <TabPanel px={0} pb={0}>
            {featureFlag.enableMultipleRewardPrograms ? (
              <CruciblesListViewNew />
            ) : (
              <CruciblesListView />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MintingTabs;
