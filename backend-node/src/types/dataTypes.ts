type Nullable<t> = t | null;

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

export type MatchingLocation = {
  lat: number;
  lng: number;
  match: number;
};

export type MatchingProperty = {
  rent: number;
  sqft: number;
  pro: boolean;
  visible: boolean;
  address: string;
  spaceId: string;
  propertyId: string;
  spaceCondition: Array<string>;
  tenantType: Array<string>;
  type: Array<string>;
  matchValue: number;
  lng: string;
  lat: string;
  thumbnail: string;
  liked: boolean;
};

type MatchingPropertyType = {
  space_id: string;
  property_id: string;
  space_condition: Array<string>;
  tenant_type: Array<string>;
  type: Array<string>;
  rent: number;
  sqft: number;
  pro: boolean;
  visible: boolean;
  address: string;
  lat: number;
  lng: number;
  match_value: number;
};

type Personas = {
  percentile: number;
  name: string;
  description: string;
  photo: string;
  tags: Array<string>;
};

export type DemographicStat = {
  my_location?: number;
  target_location: number;
  growth?: number;
};

export type DemographicTenantDetailStat = {
  growth: number;
  tenant_location: number;
  property_details: number;
};

export type DemographicStatProperty = {
  value: number;
  growth?: number;
};

export type ReceiverContact = {
  email: string;
  name: string;
  phone: string;
  role: string;
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

type Demographics<T> = {
  age: {
    '<18': T;
    '18-24': T;
    '25-34': T;
    '35-44': T;
    '45-54': T;
    '55-64': T;
    '65+': T;
  };
  income: {
    '<50K': T;
    '$50K-$74K': T;
    '$75K-$124K': T;
    '$125K-$199K': T;
    '$200K+': T;
  };
  ethnicity: {
    white: T;
    black: T;
    indian: T;
    asian: T;
    pacific_islander: T;
    other: T;
  };
  education: {
    some_highschool: T;
    high_school: T;
    some_college: T;
    associate: T;
    bachelor: T;
    masters: T;
    professional: T;
    doctorate: T;
  };
  gender: {
    male: T;
    female: T;
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
  matching_locations?: Array<MatchingLocation>;
  matching_properties?: Array<MatchingPropertyType>;
  brand_id: string;
  match_id: string;
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
      TotalHouseholds: number;
      'HouseholdGrowth2017-2022': number;
      num_metro: number;
      num_universities: number;
      num_hospitals: number;
      nearby_apartments: number;
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
    demographics1: Demographics<DemographicStat>;
    demographics3: Demographics<DemographicStat>;
    demographics5: Demographics<DemographicStat>;
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
  match_id?: string;
  name: string;
  category: string;
  number_existing_locations: number;
  on_platform: boolean;
  interested: boolean;
  verified: boolean;
  claimed: boolean;
  matches_tenant_type: boolean;
  photo_url: string;
  contacts: Array<ReceiverContact>;
};

export type PropertyMatchesType = {
  status: number;
  status_detail: string;
  property_id?: string;
  space_id?: string;
  brands?: Array<PropertyMatchesBrand>;
};

export type PropertyDetailsType = {
  status: number;
  status_detail: string;
  result?: {
    key_facts: {
      mile: number;
      DaytimePop: number;
      MedHouseholdIncome: number;
      TotalHouseholds: number;
      'HouseholdGrowth2017-2022': number;
      num_metro: number;
      num_universities: number;
      num_hospitals: number;
      nearby_apartments: number;
    };
    commute?: {
      'Public Transport': number;
      Bicycle: number;
      Carpooled: number;
      'Drove Alone': number;
      Walked: number;
      'Worked at Home': number;
    };
    personas: Array<Personas>;
    demographics1?: DemographicsProperty;
    demographics3?: DemographicsProperty;
    demographics5?: DemographicsProperty;
  };
};

export type TenantDetail = {
  brand_name: string;
  category: Nullable<string>;
  key_facts: {
    num_stores: Nullable<number>;
    years_operating: Nullable<number>;
    rating: Nullable<number>;
    num_reviews: Nullable<number>;
  };
  tenant: {
    overview: string;
    description: string;
    'physical requirements': {
      'minimum sqft': Nullable<number>;
      'frontage width': Nullable<number>;
      condition: Nullable<string>;
    };
  };
  insights: {
    personas: Array<Personas>;
    demographics1: Demographics<DemographicTenantDetailStat>;
    demographics2: Demographics<DemographicTenantDetailStat>;
    demographics3: Demographics<DemographicTenantDetailStat>;
  };
};

export type GooglePlace = {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  id: string;
  name: string;
};

export type PendingDataType = {
  matchScore: number;
  header: string;
  messageInput: {
    message: string;
    senderRole: 'LANDLORD' | 'TENANT';
  };
};

export type BrandInfo = {
  brandName: string;
  brandId: string;
  category: string;
};

export type BillingPlanType = {
  role: 'LANDLORD' | 'TENANT';
  id: string;
  cycle: 'MONTHLY' | 'ANNUALLY';
  tier: 'BASIC' | 'PROFESSIONAL';
};
