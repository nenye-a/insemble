import { FileWithPreview } from '../core-ui/Dropzone';

type AddSpace = {
  mainPhoto: FileWithPreview | null | string;
  propertyPhotos: Array<FileWithPreview | null | string>;
  description: string;
  condition: string;
  sqft: string;
  pricePerSqft: string;
  equipments: Array<string>;
  availability: string;
};

export type State = {
  canPressNext: boolean;
  addSpace: AddSpace;
};

export type Action =
  | {
      type: 'DISABLE_NEXT_BUTTON';
    }
  | {
      type: 'ENABLE_NEXT_BUTTON';
    }
  | {
      type: 'SAVE_CHANGES_ADD_SPACE';
      values: {
        addSpace: AddSpace;
      };
    };

export let landlordAddSpacelInitialState = {
  canPressNext: false,
  addSpace: {
    mainPhoto: null,
    propertyPhotos: [null, null, null, null],
    description: '',
    condition: '',
    sqft: '',
    pricePerSqft: '',
    equipments: [],
    availability: '',
  },
};

export default function landlordAddSpaceReducer(state: State, action: Action): State {
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
    case 'SAVE_CHANGES_ADD_SPACE': {
      return { ...state, ...action.values };
    }
    default:
      return state;
  }
}
