import React, { FC } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/layout';
import Footer from './components/layout/footer';
import Header from './components/layout/header';
import bg from './img/bg.jpg';
// import Faqs from './pages/faqs';
// import Landing from './pages/landing';
import NoMatch from './pages/noMatch';
import CrucibleDetail from './pages/crucibleDetail';
import CrucibleMinting from './pages/crucibleMinting';
import { useTokens } from './context/tokens';
import MobileLayover from './components/modals/MobileLayover';
import ModalRoot from './components/modals/ModalRoot';
import { Provider } from 'react-redux';
import { useCustomRPCNetworkListener } from './hooks/useCustomRPCNetworkListener';
import { useEagerConnect } from './hooks/useMetamaskEagerConnect';
import { useTransactions } from './store/transactions/useTransactions';

const App: FC = () => {
  useTokens();
  useCustomRPCNetworkListener();
  useEagerConnect();

  const { transactions } = useTransactions();
  console.log(transactions);

  return (
    <>
      <ModalRoot />
      <Flex
        display={['flex', 'flex', 'none']}
        minHeight='100vh'
        flexDirection='column'
        background={`url(${bg})`}
        backgroundRepeat='no-repeat'
        backgroundAttachment='fixed'
        backgroundSize='cover'
      >
        <MobileLayover />
      </Flex>
      <Flex
        display={['none', 'none', 'flex']}
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
              <Route
                exact
                path={process.env.PUBLIC_URL + '/'}
                component={CrucibleMinting}
              />
              <Route
                path={process.env.PUBLIC_URL + '/crucible/:crucibleId'}
                component={CrucibleDetail}
              />
              <Redirect from='/crucible/' to='/' />

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
    </>
  );
};

export default App;
