import EventEmitter from './EventEmitter';
import localStorage from './localStorage';
import { Credentials } from '../types/types';

type AuthEvents = {
  credentialsUpdated: Credentials;
};

let credentials = {
  landlordToken: localStorage.getLandlordToken() || '',
  tenantToken: localStorage.getTenantToken() || '',
  role: localStorage.getRole() || '',
};

export let authEmitter = EventEmitter.create<AuthEvents>();

export let tenantAuthorization = {
  redirectPath: '/',
  isAuthorized: isTenantAuthorized,
};

export let landlordAuthorization = {
  redirectPath: '/landlord/login',
  isAuthorized: isLandlordAuthorized,
};

function isTenantAuthorized() {
  let credentials = getCredentials();
  return !!credentials.tenantToken;
}

function isLandlordAuthorized() {
  let credentials = getCredentials();
  return !!credentials.landlordToken;
}

export function getCredentials() {
  return credentials;
}

export function saveCredentials(newCredentials: Partial<Credentials>) {
  credentials = { ...credentials, ...newCredentials };
  for (let [key, value] of Object.entries(credentials)) {
    if (key && value) {
      localStorage.writeToStorage(key, value);
    }
  }
  authEmitter.emit('credentialsUpdated', {
    role: credentials.role,
    landlordToken: credentials.landlordToken,
    tenantToken: credentials.tenantToken,
  });
}

export function logout() {
  localStorage.clearAllFromStorage();
  authEmitter.emit('credentialsUpdated', { role: '', landlordToken: '', tenantToken: '' });
}
