import { LocationData } from './LocationData';

export type Action =
  | {
      type: 'LOCATION_LOADING';
    }
  | {
      type: 'LOCATION_LOADED';
      payload: LocationData;
    }
  | {
      type: 'LOCATION_ERROR';
      payload: string;
    }
  | {
      type: 'LOCATION_CLEAR';
      payload?: null;
    }
  | {
      type: 'MAP_LOADING';
    }
  | {
      type: 'MAP_LOADED';
      payload: unknown;
    }
  | {
      type: 'MAP_ERROR';
    };
