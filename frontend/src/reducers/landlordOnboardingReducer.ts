import { LocationInput } from '../generated/globalTypes';

type ConfirmProperty = {
  physicalAddress: LocationInput;
  userRelation: string;
  propertyType: Array<string>;
};

type ConfirmLocation = {
  physicalAddress: LocationInput;
  marketingPreference: string; // This should be enum
};

type ConfirmTenant = {
  businessType: Array<string>;
  selectedRetailCategories: Array<string>;
  existingExclusives: Array<string>;
};

export type State = {
  canPressNext: boolean;
  confirmProperty?: ConfirmProperty;
  confirmLocation?: ConfirmLocation;
  confirmTenant?: ConfirmTenant;
};

export type Action =
  | {
      type: 'DISABLE_NEXT_BUTTON';
    }
  | {
      type: 'ENABLE_NEXT_BUTTON';
    }
  | {
      type: 'SAVE_CHANGES_CONFIRM_PROPERTY';
      values: { confirmProperty: ConfirmProperty };
    }
  | {
      type: 'SAVE_CHANGES_CONFIRM_LOCATION';
      values: { confirmLocation: ConfirmLocation };
    }
  | {
      type: 'SAVE_CHANGES_CONFIRM_TENANT';
      values: { confirmTenant: ConfirmTenant };
    };

export let landlordOnboardingInitialState = {
  canPressNext: false,
};

export default function landlordOnboardingReducer(state: State, action: Action): State {
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
    case 'SAVE_CHANGES_CONFIRM_PROPERTY':
    case 'SAVE_CHANGES_CONFIRM_LOCATION':
    case 'SAVE_CHANGES_CONFIRM_TENANT': {
      return { ...state, ...action.values };
    }
    default:
      return state;
  }
}
