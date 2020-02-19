let asyncStorage = {
  saveRole: (role: string) => {
    window.localStorage.setItem('role', role);
  },
  saveTenantToken: (token: string) => {
    window.localStorage.setItem('tenant-token', token);
  },
  saveBrandId: (brandId: string) => {
    window.localStorage.setItem('brand-id', brandId);
  },
  getRole: () => {
    return window.localStorage.getItem('role');
  },
  getTenantToken: () => {
    return window.localStorage.getItem('tenant-token');
  },
  getBrandId: () => {
    window.localStorage.getItem('brand-id');
  },
  removeRole: () => {
    return window.localStorage.removeItem('role');
  },
  removeTenantToken: () => {
    return window.localStorage.removeItem('tenant-token');
  },
};

export default asyncStorage;
