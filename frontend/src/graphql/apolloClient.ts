import { ApolloClient } from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { RestLink } from 'apollo-link-rest';
import { DJANGO_API } from '../constants/uris';

const cache = new InMemoryCache();

const errorLink = onError((_) => {
  // TODO: handle error
});

const restLink = new RestLink({
  uri: DJANGO_API,
});

//local state management
const stateLink = withClientState({
  defaults: {
    // default state
  },
  resolvers: {},
  cache,
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, restLink, stateLink]),
  cache,
});

export default client;
