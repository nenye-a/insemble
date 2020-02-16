import { GPlaceResult } from '../core-ui/MultiSelectLocation';

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
  categories: Array<string>;
  userRelation: string;
};

export type TenantGoals = {
  newLocationPlan?: NewLocationPlanObj;
  location: Array<GPlaceResult>;
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
};

export type PhysicalSiteCriteria = {
  minSize?: number;
  maxSize?: number;
  minFrontageWidth?: number;
  maxFrontageWidth?: number;
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
      type: 'SAVE_CHANGES';
      values: ConfirmBusinessDetail | TenantGoals | TargetCustomers | PhysicalSiteCriteria;
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
    case 'SAVE_CHANGES': {
      return { ...state, ...action.values };
    }
    default:
      return state;
  }
}
