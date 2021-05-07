import React from 'react';
import styled from '@emotion/styled';
import { Center, Flex, Text, VStack } from '@chakra-ui/layout';
import { useEffect } from 'react';

const FullScreenLayover = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
`;

const MobileLayover = () => {
  return (
    <FullScreenLayover>
      <Center>
        <Flex
          p={10}
          bg='purple.800'
          flexDir='column'
          mt={[32, 32, 40]}
          textAlign='center'
          width='85%'
          borderRadius='3xl'
          boxShadow='xl'
          minH='400px'
        >
          <Flex justifyContent='center' alignItems='center' flexGrow={1}>
            <VStack>
              <Text pt={4}>
                <strong>Unsupported Device</strong>
              </Text>
              <Text>
                We're still working through transmuting our Crucible Minting
                desktop experience to a mobile friendly state. For now please
                visit our site through a desktop.
              </Text>
            </VStack>
          </Flex>
        </Flex>
      </Center>
    </FullScreenLayover>
  );
};

export default MobileLayover;
