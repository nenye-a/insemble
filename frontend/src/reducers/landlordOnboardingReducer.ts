import { SelectedLocation } from '../components/LocationInput';

type ConfirmLocation = {
  userRelation?: string;
  propertyType?: Array<string>;
  physicalAddress?: SelectedLocation;
  marketingPreference?: string; // This should be enum
};

type ConfirmTenant = {
  businessType: Array<string>;
  otherBussinessType?: string;
  selectedRetailCategories: Array<string>;
  existingExclusives: Array<string>;
};

type SpaceListing = {
  mainPhoto: Blob;
  propertyPhotos: Array<Blob>;
  description: string;
  condition: string;
  sqft: string;
  pricePerSqft: string;
  equipments: Array<string>;
  availability: string;
};

export type State = {
  canPressNext: boolean;
  confirmLocation?: ConfirmLocation;
  confirmTenant?: ConfirmTenant;
  spaceListing?: SpaceListing;
};

export type Action =
  | {
      type: 'DISABLE_NEXT_BUTTON';
    }
  | {
      type: 'ENABLE_NEXT_BUTTON';
    }
  | {
      type: 'SAVE_CHANGES_CONFIRM_LOCATION';
      values: {
        confirmLocation: ConfirmLocation;
      };
    }
  | {
      type: 'SAVE_CHANGES_CONFIRM_TENANT';
      values: { confirmTenant: ConfirmTenant };
    }
  | {
      type: 'SAVE_CHANGES_NEW_LISTING';
      values: { spaceListing: SpaceListing };
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
    case 'SAVE_CHANGES_CONFIRM_LOCATION':
    case 'SAVE_CHANGES_CONFIRM_TENANT':
    case 'SAVE_CHANGES_NEW_LISTING': {
      return { ...state, ...action.values };
    }
    default:
      return state;
  }
}
