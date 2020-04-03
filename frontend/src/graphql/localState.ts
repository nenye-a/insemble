import { LocationInput } from '../generated/globalTypes';
import { NEW_LOCATION_PLAN_OPTIONS } from '../constants/locationPlan';
import {
  INITIAL_MIN_AGE,
  INITIAL_MAX_AGE,
  INITIAL_MIN_INCOME,
  INITIAL_MAX_INCOME,
} from '../constants/initialValues';

type WithTypename = { __typename: string };

export type UserContent = {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  company: string;
  tier: string;
  role: string;
};

type UserState = { userState: { __typename: string } & UserContent };

export type ErrorContent = {
  locationPreview: boolean;
};

export type ErrorState = {
  errorState: { __typename: string } & ErrorContent;
};

// TODO: clean up
export enum NewLocationPlan {
  YES = 'YES',
  NOT_ACTIVE = 'NOT_ACTIVE',
  NOT_PLANNING = 'NOT_PLANNING',
}

export type NewLocationPlanObj = {
  label: string;
  value: NewLocationPlan;
};

export type ConfirmBusinessDetail = WithTypename & {
  name: string;
  location: LocationInput & WithTypename;
  categories: Array<string>;
  userRelation: string;
  otherUserRelation?: string;
};

export type TenantGoals = WithTypename & {
  newLocationPlan: NewLocationPlanObj & WithTypename;
  location: Array<LocationInput>;
  locationCount?: string;
};

export type TargetCustomers = WithTypename & {
  minAge: number;
  maxAge: number;
  noAgePreference: boolean;
  minIncome: number;
  maxIncome: number;
  personas: Array<string>;
  noPersonasPreference: boolean;
  educations: Array<string>;
  noEducationsPreference: boolean;
  minDaytimePopulation: string;
  noMinDaytimePopulationPreference: boolean;
};

export type PhysicalSiteCriteria = WithTypename & {
  minSize: string;
  maxSize: string;
  minFrontageWidth: string;
  equipments: Array<string>;
  spaceType: Array<string>;
};

export type TenantOnboardingContent = {
  confirmBusinessDetail: ConfirmBusinessDetail;
  tenantGoals: TenantGoals;
  targetCustomers: TargetCustomers;
  physicalSiteCriteria: PhysicalSiteCriteria;
  pendingData: boolean;
};

export type TenantOnboardingState = {
  tenantOnboardingState: {
    __typename: string;
  } & TenantOnboardingContent;
};

export type RootState = UserState & ErrorState & TenantOnboardingState;

export const initialTenantOnboardingState = {
  __typename: 'TenantOnboardingState',
  pendingData: false,
  confirmBusinessDetail: {
    __typename: 'TenantOnboardingConfirmBusinessDetail',
    name: '',
    categories: [],
    userRelation: '',
    location: {
      __typename: 'LocationInput',
      address: '',
      lat: '',
      lng: '',
    },
    otherUserRelation: '',
  },
  tenantGoals: {
    __typename: 'TenantOnboardingTenantGoals',
    newLocationPlan: {
      __typename: 'TenantOnboardingTenantGoalsNewLocationPlan',
      ...NEW_LOCATION_PLAN_OPTIONS[0],
    },
    location: [],
    locationCount: '',
  },
  targetCustomers: {
    __typename: 'TenantOnboardingTargetCustomers',
    minAge: INITIAL_MIN_AGE,
    maxAge: INITIAL_MAX_AGE,
    noAgePreference: false,
    minIncome: INITIAL_MIN_INCOME,
    maxIncome: INITIAL_MAX_INCOME,
    personas: [],
    noPersonasPreference: false,
    educations: [],
    noEducationsPreference: false,
    minDaytimePopulation: '',
    noMinDaytimePopulationPreference: false,
  },
  physicalSiteCriteria: {
    __typename: 'TenantOnboardingPhysicalSiteCriteria',
    minSize: '',
    maxSize: '',
    minFrontageWidth: '',
    equipments: [],
    spaceType: [],
  },
};

export const defaultState: RootState = {
  userState: {
    __typename: 'UserState',
    token: '',
    email: '',
    firstName: '',
    lastName: '',
    avatar: '',
    company: '',
    tier: '',
    role: '',
  },
  errorState: {
    __typename: 'ErrorState',
    locationPreview: false,
  },
  tenantOnboardingState: initialTenantOnboardingState,
};
