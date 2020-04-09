import React, { useReducer, useState } from 'react';
import styled from 'styled-components';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useMutation } from '@apollo/react-hooks';

import { View, TextInput, Button } from '../../core-ui';
import { NumberInput, ExpiryInput, CvcInput } from './CardInput';
import {
  RegisterPaymentMethod,
  RegisterPaymentMethodVariables,
} from '../../generated/RegisterPaymentMethod';
import {
  REGISTER_PAYMENT_METHOD,
  GET_PAYMENT_METHOD_LIST,
} from '../../graphql/queries/server/billing';

let initialNewCardState = {
  name: '',
  address: '',
  address2: '',
  city: '',
  state: '',
  zipcode: '',
};

type NewCardState = typeof initialNewCardState;
type NewCardAction =
  | {
      type: 'EDIT';
      key: keyof NewCardState;
      value: string;
    }
  | {
      type: 'RESET';
    };

type Props = {
  onFinishCreatingPaymentMethod?: () => void;
};

export default function AddNewCardForm(props: Props) {
  let { onFinishCreatingPaymentMethod } = props;
  let [state, dispatch] = useReducer(reducer, initialNewCardState);
  let [isSaving, setSaving] = useState(false);
  let stripe = useStripe();
  let elements = useElements();

  let [registerPaymentMethod, { loading }] = useMutation<
    RegisterPaymentMethod,
    RegisterPaymentMethodVariables
  >(REGISTER_PAYMENT_METHOD, {
    refetchQueries: [
      {
        query: GET_PAYMENT_METHOD_LIST,
      },
    ],
    awaitRefetchQueries: true,
  });

  let disableSave = !stripe || !elements || isSaving || loading;

  let onSavePress = async () => {
    if (!stripe || !elements) {
      return;
    }
    let cardNumberEl = elements.getElement(CardNumberElement);
    if (cardNumberEl) {
      setSaving(true);
      let result = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberEl,
        billing_details: toBillingDetails(state),
      });
      setSaving(false);
      if (result.error || !result.paymentMethod) {
        // eslint-disable-next-line no-console
        console.log('Failed creating payment method', result.error);
        return;
      }

      await registerPaymentMethod({
        variables: {
          paymentMethodId: result.paymentMethod.id,
        },
      });
      onFinishCreatingPaymentMethod && onFinishCreatingPaymentMethod();
      dispatch({ type: 'RESET' });
    }
  };
  return (
    <>
      <RowView>
        <NumberInput />
        <ExpiryInput />
        <CvcInput />
      </RowView>
      <RowView>
        <TextInput
          label="Name on Card"
          placeholder="Name on card"
          value={state.name}
          onChange={(e) => dispatch({ type: 'EDIT', key: 'name', value: e.target.value })}
          containerStyle={inputRow}
        />
      </RowView>
      <RowView>
        <TextInput
          label="Billing Address"
          value={state.address}
          onChange={(e) => dispatch({ type: 'EDIT', key: 'address', value: e.target.value })}
          placeholder="Your address"
          containerStyle={inputRow}
        />
        <TextInput
          label="Billing Address Line 2 (Optional)"
          value={state.address2}
          onChange={(e) => dispatch({ type: 'EDIT', key: 'address2', value: e.target.value })}
          placeholder="Ex: Building or Unit number"
          containerStyle={{ ...inputRow, marginLeft: 8, maxWidth: '30%' }}
        />
      </RowView>
      <RowView>
        <TextInput
          label="City"
          value={state.city}
          onChange={(e) => dispatch({ type: 'EDIT', key: 'city', value: e.target.value })}
          placeholder="City"
          containerStyle={{ ...inputRow, maxWidth: '150px' }}
        />
        <TextInput
          label="State"
          value={state.state}
          onChange={(e) => dispatch({ type: 'EDIT', key: 'state', value: e.target.value })}
          placeholder="CA"
          containerStyle={{ ...inputRow, maxWidth: '60px', margin: '0 12px' }}
        />
        <TextInput
          label="Zip Code"
          value={state.zipcode}
          onChange={(e) => dispatch({ type: 'EDIT', key: 'zipcode', value: e.target.value })}
          placeholder="12345"
          containerStyle={{ ...inputRow, maxWidth: '80px' }}
        />
      </RowView>
      <SaveButtonContainer>
        <Button text="Save" onPress={onSavePress} loading={disableSave} />
      </SaveButtonContainer>
    </>
  );
}

function toBillingDetails(state: NewCardState) {
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

function reducer(state: NewCardState, action: NewCardAction) {
  switch (action.type) {
    case 'EDIT':
      return { ...state, [action.key]: action.value };
    case 'RESET':
      return { ...initialNewCardState };
    default:
      return state;
  }
}

let inputRow = {
  paddingTop: 8,
  paddingBottom: 8,
  flex: 1,
};

const RowView = styled(View)`
  flex-direction: row;
`;

const SaveButtonContainer = styled(View)`
  align-items: flex-end;
`;
