import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/layout';
import Footer from './components/layout/footer';
import Header from './components/layout/header';
import bg from './img/bg.jpg';
// import Faqs from './pages/faqs';
// import Landing from './pages/landing';
import NoMatch from './pages/noMatch';
import CrucibleDetail from './pages/crucibleDetail';
import CrucibleMinting from './pages/crucibleMinting';

const App: FC = () => {
  return (
    <Flex
      minHeight='100vh'
      flexDirection='column'
      background={`url(${bg})`}
      backgroundRepeat='no-repeat'
      backgroundAttachment='fixed'
      backgroundSize='cover'
    >
      <Router>
        <Header />
        <Box flexGrow={1} px={4}>
          <Switch>
            {/* <Route exact path={process.env.PUBLIC_URL + '/'}>
                <Landing />
              </Route> */}
            <Route exact path={process.env.PUBLIC_URL + '/'}>
              <CrucibleMinting />
            </Route>
            <Route path={process.env.PUBLIC_URL + '/crucible'}>
              <CrucibleDetail />
            </Route>
            {/* <Route exact path={process.env.PUBLIC_URL + '/faqs'}>
              <Faqs />
            </Route> */}
            <Route path='*'>
              <NoMatch />
            </Route>
          </Switch>
        </Box>
        <Footer />
      </Router>
    </Flex>
  );
};

export default App;
