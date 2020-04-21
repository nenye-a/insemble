import { FileWithPreview } from '../core-ui/Dropzone';
import {
  MarketingPreferenceRadio,
  MARKETING_PREFERENCE_OPTIONS,
} from '../constants/marketingPreference';

type AddSpace = {
  mainPhoto: FileWithPreview | null | string;
  propertyPhotos: Array<FileWithPreview | null | string>;
  description: string;
  condition: string;
  sqft: string;
  pricePerSqft: string;
  equipments: Array<string>;
  availability: string;
  marketingPreference: MarketingPreferenceRadio;
  spaceType?: Array<string>;
};

export type State = {
  canPressNext: boolean;
  addSpace: AddSpace;
};

export type Action = {
  type: 'SAVE_CHANGES_ADD_SPACE';
  values: {
    addSpace: AddSpace;
  };
};

export let landlordAddSpacelInitialState = {
  canPressNext: false,
  addSpace: {
    mainPhoto: null,
    propertyPhotos: [null],
    description: '',
    condition: '',
    sqft: '',
    pricePerSqft: '',
    equipments: [],
    availability: '',
    marketingPreference: MARKETING_PREFERENCE_OPTIONS[0],
  },
};

export default function landlordAddSpaceReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SAVE_CHANGES_ADD_SPACE': {
      return { ...state, ...action.values };
    }
    default:
      return state;
  }
}
