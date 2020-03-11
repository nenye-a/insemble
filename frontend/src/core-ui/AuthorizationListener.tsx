import React, { createContext, ReactElement } from 'react';
import { authEmitter, saveCredentials, getCredentials } from '../utils';
import { Credentials } from '../types/types';

type Props = {
  children: ReactElement;
};
type AuthContextType = Credentials;

let defaultContextValue = {};

export let AuthContext = createContext<AuthContextType>(defaultContextValue);

let onCredentialsUpdated = (newCredentials: Credentials) => {
  saveCredentials(newCredentials);
};

authEmitter.on('credentialsUpdated', onCredentialsUpdated);

export default function AuthorizationListener(props: Props) {
  let { children } = props;
  let value = getCredentials();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
