import { FileWithPreview } from '../core-ui/Dropzone';
import { MarketingPreference } from '../generated/globalTypes';

type AddSpace = {
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
    propertyPhotos: [],
    description: '',
    condition: '',
    sqft: '',
    pricePerSqft: '',
    equipments: [],
    availability: '',
    marketingPreference: MarketingPreference.PUBLIC,
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
