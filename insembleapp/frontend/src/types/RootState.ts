type User = {
  // TODO: What is the exact shape of this object returned from server?
  [key: string]: unknown;
};

type Heatmap = {
  // TODO: What is the exact shape of this object returned from server?
  [key: string]: unknown;
};

type Location = {
  // TODO: What is the exact shape of this object returned from server?
  [key: string]: unknown;
};

export type RootState = {
  auth: {
    token: null | string;
    isAuthenticated: boolean;
    isLoading: boolean;
    user: null | User;
  };
  space: {
    mapLoaded: null | boolean;
    heatMap: null | Heatmap;
    mapIsLoading: boolean;

    // location state
    locationLoaded: null | boolean;
    hasLocation: null | boolean;
    location: null | Location;
    locationIsLoading: boolean;
    locationErr: null | Error;
  };
};
