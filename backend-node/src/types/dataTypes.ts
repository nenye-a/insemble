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
