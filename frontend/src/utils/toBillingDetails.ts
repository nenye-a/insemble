import { NewCardState } from '../reducers/addNewCardReducer';

/**
 *
 * @param state
 * convert state to billing details stripe param
 */

export default function toBillingDetails(state: NewCardState) {
  return {
    ...(state.name ? { name: state.name } : undefined),
    address: {
      ...(state.city ? { city: state.city } : undefined),
      ...(state.address ? { line1: state.address } : undefined),
      ...(state.address2 ? { line2: state.address2 } : undefined),
      ...(state.zipcode ? { postal_code: state.zipcode } : undefined),
      ...(state.state ? { state: state.state } : undefined),
    },
  };
}
