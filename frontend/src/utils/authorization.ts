import asyncStorage from './asyncStorage';

export let tenantAuthorization = {
  redirectPath: '/',
  isAuthorized: () => {
    return !!asyncStorage.getTenantToken();
  },
};
