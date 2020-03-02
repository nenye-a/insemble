let asyncStorage = {
  saveRole: (role: string) => {
    window.localStorage.setItem('role', role);
  },
  saveTenantToken: (token: string) => {
    window.localStorage.setItem('tenant-token', token);
  },
  saveLandlordToken: (token: string) => {
    window.localStorage.setItem('landlord-token', token);
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
  getLandlordToken: () => {
    return window.localStorage.getItem('landlord-token');
  },
  getBrandId: () => {
    return window.localStorage.getItem('brand-id');
  },
  removeRole: () => {
    return window.localStorage.removeItem('role');
  },
  removeTenantToken: () => {
    return window.localStorage.removeItem('tenant-token');
  },
  removeLandlordToken: () => {
    return window.localStorage.removeItem('landlord-token');
  },
  removeBrandId: () => {
    return window.localStorage.removeItem('brand-id');
  },
};

export default asyncStorage;
