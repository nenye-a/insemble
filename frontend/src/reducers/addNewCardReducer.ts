export type NewCardState = typeof initialNewCardState;
export type NewCardAction =
  | {
      type: 'EDIT';
      key: keyof NewCardState;
      value: string;
    }
  | {
      type: 'RESET';
    };

export default function addNewCardReducer(state: NewCardState, action: NewCardAction) {
  switch (action.type) {
    case 'EDIT':
      return { ...state, [action.key]: action.value };
    case 'RESET':
      return { ...initialNewCardState };
    default:
      return state;
  }
}

export let initialNewCardState = {
  name: '',
  address: '',
  address2: '',
  city: '',
  state: '',
  zipcode: '',
};
