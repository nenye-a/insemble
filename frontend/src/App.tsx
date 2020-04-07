import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { ClientContextProvider } from 'react-fetching-library';
import { ApolloProvider } from '@apollo/react-hooks';
import { Elements as StripeProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import client from './client';
import apolloClient from './graphql/apolloClient';
import routes, { RouteType } from './routes';
import withTracker from './withTracker';

const trackingID = 'UA-153536736-1';
import ReactGA from 'react-ga';
ReactGA.initialize(trackingID);

import 'bootstrap/dist/css/bootstrap.min.css';

import ViewportListener from './core-ui/ViewportListener';

// TODO: Move the key to env, btw this is just our testing key so we need to
// change it later anyway.
let stripePromise = loadStripe('pk_n7E17YLoCCGMNWARfluYdTrVI1wiz');

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ClientContextProvider client={client}>
        <ViewportListener>
          <StripeProvider stripe={stripePromise}>
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
          </StripeProvider>
        </ViewportListener>
      </ClientContextProvider>
    </ApolloProvider>
  );
}
