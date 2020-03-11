import React, { createContext, useMemo, useState, useEffect, ReactElement } from 'react';
import { localStorage } from '../utils';
import { authEmitter } from '../utils/authorization';
import { Credentials } from '../types/types';

type Props = {
  children: ReactElement;
};
type AuthContextType = Credentials;

let defaultContextValue = {};

export let AuthContext = createContext<AuthContextType>(defaultContextValue);

export default function AuthorizationListener(props: Props) {
  let { children } = props;
  let initialState = {
    landlordToken: localStorage.getLandlordToken() || '',
    tenantToken: localStorage.getTenantToken() || '',
    role: localStorage.getRole() || '',
  };
  let [{ landlordToken, tenantToken, role }, setCredentials] = useState<AuthContextType>(
    initialState
  );

  useEffect(() => {
    let onCredentialsUpdated = (newCredential: Credentials) => {
      setCredentials(newCredential);
    };
    authEmitter.on('credentialsUpdated', onCredentialsUpdated);
    return () => {
      authEmitter.remove('credentialsUpdated', onCredentialsUpdated);
    };
  }, []);

  let value = useMemo(() => ({ landlordToken, tenantToken, role }), [
    landlordToken,
    tenantToken,
    role,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
