import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { ClientContextProvider } from 'react-fetching-library';
import { ApolloProvider } from '@apollo/react-hooks';
import { Provider as ReduxProvider } from 'react-redux';

import client from './client';
import apolloClient from './graphql/apolloClient';
import store from './redux/store';
import { loadUser } from './redux/actions/auth';
import routes, { RouteType } from './routes';
import withTracker from './withTracker';

const trackingID = 'UA-153536736-1';
import ReactGA from 'react-ga';
ReactGA.initialize(trackingID);

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/main.scss';

class App extends React.Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <ClientContextProvider client={client}>
          <ReduxProvider store={store}>
            <Router basename={process.env.REACT_APP_BASENAME || ''}>
              <Switch>
                <>
                  {routes.map((route: RouteType, index) => {
                    return (
                      <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        component={withTracker((props: RouteType) => {
                          if (
                            route?.authorization?.isAuthorized &&
                            !route.authorization.isAuthorized()
                          ) {
                            return (
                              <Redirect
                                to={{
                                  pathname: '/',
                                }}
                              />
                            );
                          }
                          let Layout = route.layout;
                          let Component = route.component;
                          return (
                            <Layout {...props} {...route?.props}>
                              <Component {...props} />
                            </Layout>
                          );
                        })}
                      />
                    );
                  })}
                </>
              </Switch>
            </Router>
          </ReduxProvider>
        </ClientContextProvider>
      </ApolloProvider>
    );
  }
}

export default App;
