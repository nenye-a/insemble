import EventEmitter from './EventEmitter';
import localStorage from './localStorage';
import { Credentials } from '../types/types';

export let tenantAuthorization = {
  redirectPath: '/',
  isAuthorized: () => {
    // TODO: might need to change this so it's not called everytime
    return !!localStorage.getTenantToken();
  },
};

export let landlordAuthorization = {
  redirectPath: '/landlord/login',
  isAuthorized: () => {
    return !!localStorage.getLandlordToken();
  },
};

type AuthEvents = {
  credentialsUpdated: Credentials;
};

export let authEmitter = EventEmitter.create<AuthEvents>();

export function saveCredentials(credentials: Credentials) {
  for (let [key, value] of Object.entries(credentials)) {
    if (key && value) {
      localStorage.writeToStorage(key, value);
    }
  }
  authEmitter.emit('credentialsUpdated', {
    role: credentials.role,
    landlordToken: credentials?.landlordToken || undefined,
    tenantToken: credentials?.tenantToken || undefined,
  });
}

export function logout() {
  localStorage.clearAllFromStorage();
  authEmitter.emit('credentialsUpdated', { role: '', landlordToken: '', tenantToken: '' });
}
