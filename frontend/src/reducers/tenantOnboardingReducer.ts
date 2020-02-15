export type ConfirmBusinessDetail = {
  name: string;
  categories: Array<string>;
  userRelation: string;
};

export type TenantGoals = {
  newLocationPlan: string;
  location: Array<object>;
  locationCount?: number;
};

export type TargetCustomers = {
  minAge?: number;
  maxAge?: number;
  minIncome?: number;
  maxIncome?: number;
  personas?: Array<string>;
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
      values: ConfirmBusinessDetail | TenantGoals | TargetCustomers | PhysicalSiteCriteria; // TODO: add type for each step
    };

export let tenantOnboardingInitialState = {
  canPressNext: false,
  confirmBusinessDetail: {
    name: '',
    categories: [],
    userRelation: '',
  },
  tenantGoals: {
    newLocationPlan: '',
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
