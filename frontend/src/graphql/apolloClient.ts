import { ApolloClient } from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { API_URI } from '../constants/uris';
import { defaultState } from './localState';
import { loginSuccess, updateTenantOnboarding } from './resolvers';
import { useCredentials } from '../utils';
import { Role } from '../types/types';

const cache = new InMemoryCache();

const authLink = setContext(async (_, { headers }) => {
  let { role, tenantToken, landlordToken } = useCredentials();
  let token = null;
  if (role === Role.TENANT) {
    token = tenantToken;
  } else if (role === Role.LANDLORD) {
    token = landlordToken;
  }
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : undefined,
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
      updateTenantOnboarding,
    },
  },
  cache,
});

const httpLink = createUploadLink({
  uri: API_URI,
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, stateLink, authLink, httpLink]),
  cache,
});

export default client;
