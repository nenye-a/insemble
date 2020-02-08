import { ApolloClient } from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { API_URI } from '../constants/uris';

const cache = new InMemoryCache();

const errorLink = onError((_) => {
  // TODO: handle error
});

//local state management
const stateLink = withClientState({
  defaults: {
    // default state
  },
  resolvers: {},
  cache,
});

const httpLink = new HttpLink({
  uri: API_URI,
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, stateLink, httpLink]),
  cache,
});

export default client;
