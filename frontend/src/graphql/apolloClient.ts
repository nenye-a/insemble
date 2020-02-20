import { ApolloClient } from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import { API_URI } from '../constants/uris';
import { defaultState } from './localState';
import { loginSuccess } from './resolvers';
import asyncStorage from '../utils/asyncStorage';

const cache = new InMemoryCache();

const authLink = setContext(async (_, { headers }) => {
  let token = await asyncStorage.getTenantToken();
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };
});

const errorLink = onError((_) => {
  // TODO: handle error
});

//local state management
const stateLink = withClientState({
  defaults: defaultState,
  resolvers: {
    Mutation: {
      loginSuccess,
    },
  },
  cache,
});

const httpLink = new HttpLink({
  uri: API_URI,
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, stateLink, authLink, httpLink]),
  cache,
});

export default client;
