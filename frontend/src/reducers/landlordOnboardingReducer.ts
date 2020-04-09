import { SelectedLocation } from '../components/LocationInput';
import { FileWithPreview } from '../core-ui/Dropzone';
import { MarketingPreference } from '../generated/globalTypes';

type ConfirmLocation = {
  userRelations: Array<string>;
  physicalAddress?: SelectedLocation;
};

type ConfirmTenant = {
  businessType: Array<string>;
  otherBusinessType?: string;
  existingExclusives: Array<string>;
};

type SpaceListing = {
  mainPhoto: FileWithPreview | null | string;
  propertyPhotos: Array<FileWithPreview | null | string>;
  description: string;
  condition: string;
  sqft: string;
  pricePerSqft: string;
  equipments: Array<string>;
  availability: string;
  marketingPreference: MarketingPreference;
  propertyType?: Array<string>;
};

export type State = {
  canPressNext: boolean;
  confirmLocation: ConfirmLocation;
  confirmTenant: ConfirmTenant;
  spaceListing: SpaceListing;
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
  confirmLocation: {
    userRelations: [],
  },
  confirmTenant: {
    businessType: ['Retail', 'Restaurant', 'Fitness', 'Entertainment'],
    existingExclusives: [],
  },
  spaceListing: {
    mainPhoto: null,
    propertyPhotos: [''],
    description: '',
    condition: '',
    sqft: '',
    pricePerSqft: '',
    equipments: [],
    availability: '',
    marketingPreference: MarketingPreference.PUBLIC,
  },
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
