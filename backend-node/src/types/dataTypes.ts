export type FilterOptions = {
  brand_categories: Array<string>;
  personas: Array<string>;
  education: Array<string>;
  commute: Array<string>;
  type: Array<string>;
  equipment: Array<string>;
  ethnicity: Array<string>;
};

export type AutoPopulateResponse = {
  categories: Array<string>;
  personas: Array<string>;
  income: {
    min: number;
    max: number;
  };
  age: {
    min: number;
    max: number;
  };
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

type Personas = {
  percentile: number;
  name: string;
  description: string;
  tags: Array<string>;
};

export type DemographicStat = {
  my_location?: number;
  target_location: number;
  growth?: number;
};

export type DemographicStatProperty = {
  value: number;
  growth?: number;
};

type NearbyObject = {
  lat: number;
  lng: number;
  name: string;
  rating: number | null;
  number_rating: number | null;
  category: string | null;
  distance: number;
  restaurant?: boolean;
  retail?: boolean;
  similar: boolean;
  hospital?: boolean;
  apartment?: boolean;
  metro?: boolean;
};

type Demographics = {
  age: {
    '<18': DemographicStat;
    '18-24': DemographicStat;
    '25-34': DemographicStat;
    '35-44': DemographicStat;
    '45-54': DemographicStat;
    '55-64': DemographicStat;
    '65+': DemographicStat;
  };
  income: {
    '<50K': DemographicStat;
    '$50K-$74K': DemographicStat;
    '$75K-$124K': DemographicStat;
    '$125K-$199K': DemographicStat;
    '$200K+': DemographicStat;
  };
  ethnicity: {
    white: DemographicStat;
    black: DemographicStat;
    indian: DemographicStat;
    asian: DemographicStat;
    pacific_islander: DemographicStat;
    other: DemographicStat;
  };
  education: {
    some_highschool: DemographicStat;
    high_school: DemographicStat;
    some_college: DemographicStat;
    associate: DemographicStat;
    bachelor: DemographicStat;
    masters: DemographicStat;
    professional: DemographicStat;
    doctorate: DemographicStat;
  };
  gender: {
    male: DemographicStat;
    female: DemographicStat;
  };
};

type DemographicsProperty = {
  age: {
    '<18': DemographicStatProperty;
    '18-24': DemographicStatProperty;
    '25-34': DemographicStatProperty;
    '35-44': DemographicStatProperty;
    '45-54': DemographicStatProperty;
    '55-64': DemographicStatProperty;
    '65+': DemographicStatProperty;
  };
  income: {
    '<50K': DemographicStatProperty;
    '$50K-$74K': DemographicStatProperty;
    '$75K-$124K': DemographicStatProperty;
    '$125K-$199K': DemographicStatProperty;
    '$200K+': DemographicStatProperty;
  };
  ethnicity: {
    white: DemographicStatProperty;
    black: DemographicStatProperty;
    indian: DemographicStatProperty;
    asian: DemographicStatProperty;
    pacific_islander: DemographicStatProperty;
    other: DemographicStatProperty;
  };
  education: {
    some_highschool: DemographicStatProperty;
    high_school: DemographicStatProperty;
    some_college: DemographicStatProperty;
    associate: DemographicStatProperty;
    bachelor: DemographicStatProperty;
    masters: DemographicStatProperty;
    professional: DemographicStatProperty;
    doctorate: DemographicStatProperty;
  };
  gender: {
    male: DemographicStatProperty;
    female: DemographicStatProperty;
  };
};

export type TenantMatchesType = {
  status: number;
  status_detail: string;
  matching_locations?: Array<MatchingLocationType>;
  matching_properties?: Array<MatchingPropertyType>;
  tenant_id: string;
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

export type LocationDetailsType = {
  status: number;
  status_detail: string;
  result?: {
    match_value: number;
    affinities: {
      growth: boolean;
      personas: boolean;
      demographics: boolean;
      ecosystem: boolean;
    };
    key_facts: {
      mile: number;
      DaytimePop: number;
      MedHouseholdIncome: number;
      TotalHousholds: number;
      'HouseholdGrowth2017-2022': number;
      num_metro: number;
      num_universities: number;
      num_hospitals: number;
      num_apartments: number;
    };
    commute: {
      'Public Transport': number;
      Bicycle: number;
      Carpooled: number;
      'Drove Alone': number;
      Walked: number;
      'Worked at Home': number;
    };
    top_personas: Array<Personas>;
    demographics1: Demographics;
    demographics3: Demographics;
    demographics5: Demographics;
    nearby: Array<NearbyObject>;
  };
  property_details?: {
    '3D_tour': string;
    main_photo: string;
    sqft: number;
    photos: Array<string>;
    summary: {
      'price/sqft': number;
      type: string;
      condition: string;
    };
    description: string;
  };
};

type PropertyMatchesBrand = {
  match_value: number;
  brand_id: string;
  name: string;
  category: string;
  num_existing_locations: number;
  on_platform: boolean;
  interested: boolean;
  verified: boolean;
  claimed: boolean;
  matches_tenant_type: boolean;
  photo_url: string;
};

export type PropertyMatchesType = {
  status: number;
  status_detail: string;
  property_id?: string;
  space_id?: string;
  brands?: Array<PropertyMatchesBrand>;
};

export type TenantDetail = {
  key_facts: {
    num_stores: number;
    years_operating: number;
    rating: number;
    num_reviews: number;
  };
  tenant: {
    overview: string;
    description: string;
    'physical requirements': {
      'minimum sqft': number;
      'frontage width': number;
      condition: 'White Box';
    };
  };
  insights: {
    personas: Array<Personas>;
    demographics1: Demographics;
    demographics2: Demographics;
    demographics3: Demographics;
  };
};
