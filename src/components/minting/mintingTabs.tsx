import React, { FC, useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/layout';
import { useCrucibles } from '../../context/crucibles';
import { Spinner } from '@chakra-ui/spinner';
import CruciblesListView from '../crucible/cruciblesListView';
import MintingForm from './mintingForm';

const MintingTabs: FC = () => {
  const { crucibles, isLoading } = useCrucibles();
  const [tabIndex, setTabIndex] = useState(
    crucibles && crucibles.length > 0 ? 1 : 0
  );
  const crucibleCount = crucibles?.length || 0;
  useEffect(() => {
    if (crucibleCount > 0) {
      setTabIndex(1);
    }
  }, [crucibleCount]);

  const tabProps = {
    borderRadius: 'lg',
    fontWeight: 'bold',
    _selected: { color: 'purple.800', bg: 'cyan.400' },
  };

  if (isLoading) {
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
      <Heading top='-120px' position='absolute' width='100%'>
        {tabIndex === 0 ? 'Mint a Crucible' : 'Crucibles Collection'}
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
            <CruciblesListView />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MintingTabs;
