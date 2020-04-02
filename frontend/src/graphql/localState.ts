import { LocationInput } from '../generated/globalTypes';

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
  location?: LocationInput;
  categories: Array<string>;
  userRelation: string;
  otherUserRelation?: string;
};

export type TenantGoals = WithTypename & {
  newLocationPlan?: NewLocationPlanObj;
  location: Array<LocationInput>;
  locationCount?: string;
};

export type TargetCustomers = WithTypename & {
  minAge?: number;
  maxAge?: number;
  noAgePreference?: boolean;
  minIncome?: number;
  maxIncome?: number;
  personas?: Array<string>;
  noPersonasPreference?: boolean;
  educations?: Array<string>;
  noEducationsPreference?: boolean;
  minDaytimePopulation?: string;
  noMinDaytimePopulationPreference?: boolean;
};

export type PhysicalSiteCriteria = WithTypename & {
  minSize?: number | string;
  maxSize?: number | string;
  minFrontageWidth?: number | string;
  equipments?: Array<string>;
  spaceType?: Array<string>;
};

type TenantOnboardingContent = {
  confirmBusinessDetail: ConfirmBusinessDetail;
  tenantGoals: TenantGoals;
  targetCustomers: TargetCustomers;
  physicalSiteCriteria: PhysicalSiteCriteria;
};

type TenantOnboardingState = {
  tenantOnboardingState: {
    __typename: string;
  } & TenantOnboardingContent;
};

export type RootState = UserState & ErrorState & TenantOnboardingState;

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
  tenantOnboardingState: {
    __typename: 'TenantOnboardingState',
    confirmBusinessDetail: {
      __typename: 'TenantOnboardingConfirmBusinessDetail',
      name: '',
      categories: [],
      userRelation: '',
    },
    tenantGoals: {
      __typename: 'TenantOnboardingTenantGoals',
      newLocationPlan: undefined,
      location: [],
    },
    targetCustomers: {
      __typename: 'TenantOnboardingTargetCustomers',
    },
    physicalSiteCriteria: {
      __typename: 'TenantOnboardingPhysicalSiteCriteria',
    },
  },
};
