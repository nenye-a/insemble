import Maybe from 'graphql/tsutils/Maybe';

export type FilterOptions = {
  brand_categories: Array<string>;
  personas: Array<string>;
  education: Array<string>;
  commute: Array<string>;
  type: Array<string>;
};

type MatchingLocationType = {
  lat: number;
  lng: number;
  match: number;
  loc_id: string;
};

type MatchingPropertyType = {
  property_id: string;
  address: string;
  rent: number;
  sqft: number;
  type: string;
};

export type TenantMatchesType = {
  status: number;
  status_detail: string;
  matching_locations?: Array<MatchingLocationType>;
  matching_properties?: Array<MatchingPropertyType>;
};

export type LocationPreviewType = {
  status: number;
  status_detail: string;
  target_address: string;
  target_neighborhood: string;
  DaytimePop_3mile: number;
  median_income: number;
  'median_age ': number; // Remove space after fixed
};
