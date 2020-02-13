let asyncStorage = {
  saveRole: (role: string) => {
    window.localStorage.setItem('role', role);
  },
  saveTenantToken: (token: string) => {
    window.localStorage.setItem('tenant-token', token);
  },
  getRole: () => {
    return window.localStorage.getItem('role');
  },
  getTenantToken: () => {
    return window.localStorage.getItem('tenant-token');
  },
  removeRole: () => {
    return window.localStorage.removeItem('role');
  },
  removeTenantToken: () => {
    return window.localStorage.removeItem('tenant-token');
  },
};

export default asyncStorage;
