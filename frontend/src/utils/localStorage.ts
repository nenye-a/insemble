let localStorage = {
  writeToStorage: (key: string, newValue: string) => {
    window.localStorage.setItem(key, newValue);
  },
  clearAllFromStorage: () => {
    window.localStorage.clear();
  },
  getRole: () => {
    return window.localStorage.getItem('role');
  },
  getLandlordToken: () => {
    return window.localStorage.getItem('landlordToken');
  },
  getTenantToken: () => {
    return window.localStorage.getItem('tenantToken');
  },
};

export default localStorage;
