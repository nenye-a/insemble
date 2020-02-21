import { LocationInput } from '../generated/globalTypes';

export enum NewLocationPlan {
  YES = 'YES',
  NOT_ACTIVE = 'NOT_ACTIVE',
  NOT_PLANNING = 'NOT_PLANNING',
}

export type NewLocationPlanObj = {
  label: string;
  value: NewLocationPlan;
};

export type ConfirmBusinessDetail = {
  name: string;
  location?: LocationInput;
  categories: Array<string>;
  userRelation: string;
  otherUserRelation?: string;
};

export type TenantGoals = {
  newLocationPlan?: NewLocationPlanObj;
  location: Array<LocationInput>;
  locationCount?: string;
};

export type TargetCustomers = {
  minAge?: number;
  maxAge?: number;
  noAgePreference?: boolean;
  minIncome?: number;
  maxIncome?: number;
  noIncomePreference?: boolean;
  personas?: Array<string>;
  noPersonasPreference?: boolean;
  educations?: Array<string>;
  noEducationsPreference?: boolean;
  minDaytimePopulation?: string;
};

export type PhysicalSiteCriteria = {
  minSize?: number | string;
  maxSize?: number | string;
  minFrontageWidth?: number | string;
  maxFrontageWidth?: number | string;
  equipments?: Array<string>;
  spaceType?: Array<string>;
};

export type State = {
  canPressNext: boolean;
  confirmBusinessDetail: ConfirmBusinessDetail;
  tenantGoals: TenantGoals;
  targetCustomers: TargetCustomers;
  physicalSiteCriteria: PhysicalSiteCriteria;
};

export type Action =
  | {
      type: 'DISABLE_NEXT_BUTTON';
    }
  | {
      type: 'ENABLE_NEXT_BUTTON';
    }
  | {
      type: 'SAVE_CHANGES_CONFIRM_BUSINESS_DETAIL';
      values: { confirmBusinessDetail: ConfirmBusinessDetail };
    }
  | {
      type: 'SAVE_CHANGES_TENANT_GOALS';
      values: { tenantGoals: TenantGoals };
    }
  | {
      type: 'SAVE_CHANGES_TARGET_CUSTOMERS';
      values: { targetCustomers: TargetCustomers };
    }
  | {
      type: 'SAVE_CHANGES_PHYSICAL_SITE_CRITERIA';
      values: { physicalSiteCriteria: PhysicalSiteCriteria };
    };

export let tenantOnboardingInitialState = {
  canPressNext: false,
  confirmBusinessDetail: {
    name: '',
    categories: [],
    userRelation: '',
  },
  tenantGoals: {
    newLocationPlan: undefined,
    location: [],
  },
  targetCustomers: {},
  physicalSiteCriteria: {},
};

export default function tenantOnboardingReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'DISABLE_NEXT_BUTTON': {
      return {
        ...state,
        canPressNext: false,
      };
    }
    case 'ENABLE_NEXT_BUTTON': {
      return { ...state, canPressNext: true };
    }
    case 'SAVE_CHANGES_CONFIRM_BUSINESS_DETAIL':
    case 'SAVE_CHANGES_TENANT_GOALS':
    case 'SAVE_CHANGES_TARGET_CUSTOMERS':
    case 'SAVE_CHANGES_PHYSICAL_SITE_CRITERIA': {
      return { ...state, ...action.values };
    }
    default:
      return state;
  }
}
