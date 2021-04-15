import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/layout';
import Footer from './components/footer';
import Header from './components/header';
import bg from './img/bg.jpg';
// import Faqs from './pages/faqs';
// import Landing from './pages/landing';
import NoMatch from './pages/noMatch';
import CrucibleDetail from './pages/crucibleDetail';
import CrucibleMinting from './pages/crucibleMinting';

const App: React.FC = () => {
  return (
    <Flex
      px={4}
      minHeight='100vh'
      flexDirection='column'
      background={`url(${bg})`}
      backgroundPosition='center'
      backgroundRepeat='no-repeat'
      backgroundAttachment='fixed'
      backgroundSize='cover'
    >
      <Router>
        <Header />
        <Box flexGrow={1}>
          <Switch>
            {/* <Route exact path={process.env.PUBLIC_URL + '/'}>
                <Landing />
              </Route> */}
            <Route exact path={process.env.PUBLIC_URL + '/'}>
              <CrucibleMinting />
            </Route>
            <Route exact path={process.env.PUBLIC_URL + '/crucible'}>
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
