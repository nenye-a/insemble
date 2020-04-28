import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import { persistCache } from 'apollo-cache-persist';
import { createUploadLink } from 'apollo-upload-client';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';

import { API_URI } from '../constants/uris';
import { defaultState } from './localState';
import { loginSuccess } from './resolvers';
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

const httpLink = createUploadLink({
  uri: API_URI,
});

async function initPersistCache() {
  await persistCache({
    cache,
    storage: window.localStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>,
  });
}

function initApolloClient() {
  initPersistCache();
  cache.writeData({ data: defaultState });
  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    resolvers: {
      Mutation: {
        loginSuccess,
      },
    },
    cache,
  });
  return client;
}

export const apolloClient = initApolloClient();
