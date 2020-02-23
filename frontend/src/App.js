import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import { ClientContextProvider } from 'react-fetching-library';
import { ApolloProvider } from '@apollo/react-hooks';
import { Provider as ReduxProvider } from 'react-redux';

import client from './client';
import apolloClient from './graphql/apolloClient';
import store from './redux/store';
import { loadUser } from './redux/actions/auth';
import routes from './routes';
import withTracker from './withTracker';

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: '80px',
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const trackingID = 'UA-153536736-1';
import ReactGA from 'react-ga';
ReactGA.initialize(trackingID);

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/main.scss';

const MyTemplate = ({ style, message, close }) => (
  <div style={style} className="alert alert-danger alert-dismissible fade show">
    {message}
    <button type="button" className="close" onClick={close} data-dismiss="alert">
      &times;
    </button>
  </div>
);

class App extends React.Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <ClientContextProvider client={client}>
          <AlertProvider template={MyTemplate} {...options}>
            <ReduxProvider store={store}>
              <Router basename={process.env.REACT_APP_BASENAME || ''}>
                <Switch>
                  <>
                    {routes.map((route, index) => {
                      return (
                        <Route
                          key={index}
                          path={route.path}
                          exact={route.exact}
                          component={withTracker((props) => {
                            if (
                              route.authorization &&
                              route.authorization.isAuthorized &&
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
                            return (
                              <route.layout {...props} {...route.props}>
                                <route.component {...props} />
                              </route.layout>
                            );
                          })}
                        />
                      );
                    })}
                  </>
                </Switch>
              </Router>
            </ReduxProvider>
          </AlertProvider>
        </ClientContextProvider>
      </ApolloProvider>
    );
  }
}

export default App;
