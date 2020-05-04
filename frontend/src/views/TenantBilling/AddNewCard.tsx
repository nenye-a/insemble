import React, { useState, useReducer } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { Button, Modal, View } from '../../core-ui';
import AddNewCardForm from '../Billing/AddNewCardForm';
import addNewCardReducer, { initialNewCardState } from '../../reducers/addNewCardReducer';
import {
  RegisterPaymentMethod,
  RegisterPaymentMethodVariables,
} from '../../generated/RegisterPaymentMethod';
import {
  REGISTER_PAYMENT_METHOD,
  GET_PAYMENT_METHOD_LIST,
} from '../../graphql/queries/server/billing';
import { toBillingDetails } from '../../utils';

export default function AddNewCard() {
  let [isModalVisible, setModalVisibility] = useState(false);

  return (
    <>
      <AddNewCardModal isModalVisible={isModalVisible} onClose={() => setModalVisibility(false)} />
      <Button
        text="Add new card"
        mode="transparent"
        onPress={() => setModalVisibility(!isModalVisible)}
      />
    </>
  );
}

export function AddNewCardModal({
  isModalVisible,
  onClose,
  preventClosingOnSubmit,
}: {
  isModalVisible: boolean;
  onClose: () => void;
  preventClosingOnSubmit?: boolean;
}) {
  let [isSaving, setSaving] = useState(false);
  let [error, setError] = useState('');
  let [state, dispatch] = useReducer(addNewCardReducer, initialNewCardState);
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
        setError(result.error?.message || '');
        return;
      }

      await registerPaymentMethod({
        variables: {
          paymentMethodId: result.paymentMethod.id,
        },
      });
      dispatch({ type: 'RESET' });
      !preventClosingOnSubmit && onClose();
    }
  };

  return (
    <AddNewCardModalContainer visible={isModalVisible} onClose={onClose}>
      <AddNewCardForm state={state} dispatch={dispatch} error={error} />
      <SaveButtonContainer>
        <Button text="Save" onPress={onSavePress} loading={disableSave} />
      </SaveButtonContainer>
    </AddNewCardModalContainer>
  );
}

const AddNewCardModalContainer = styled(Modal)`
  width: 640px;
  height: 360px;
  padding: 24px;
`;

const SaveButtonContainer = styled(View)`
  margin-top: 4px;
  align-items: flex-end;
`;
