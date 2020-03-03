import asyncStorage from './asyncStorage';

export let tenantAuthorization = {
  redirectPath: '/',
  isAuthorized: () => {
    return !!asyncStorage.getTenantToken();
  },
};

export let landlordAuthorization = {
  redirectPath: '/landlord/login',
  isAuthorized: () => {
    return !!asyncStorage.getLandlordToken();
  },
};
