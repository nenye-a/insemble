import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ClientContextProvider } from 'react-fetching-library';
import { ApolloProvider } from '@apollo/react-hooks';
import { Elements as StripeProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ReactGA from 'react-ga';

import client from './client';
import apolloClient from './graphql/apolloClient';
import { ViewportListener } from './core-ui';
import MainRoute from './router/MainRoute';

import 'bootstrap/dist/css/bootstrap.min.css';

const trackingID = 'UA-153536736-1';
ReactGA.initialize(trackingID);

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
              <MainRoute />
            </Router>
          </StripeProvider>
        </ViewportListener>
      </ClientContextProvider>
    </ApolloProvider>
  );
}
