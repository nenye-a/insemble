import React, { useState, useReducer } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js';

import { View, Text, Button, LoadingIndicator, Alert } from '../../core-ui';
import { ContactInsemble } from '../../components';
import {
  FONT_WEIGHT_LIGHT,
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  FONT_WEIGHT_BOLD,
} from '../../constants/theme';
import { THEME_COLOR, DARK_TEXT_COLOR } from '../../constants/colors';
import CreditCardTable from '../Billing/CreditCardTable';
import InvoicePreview from '../Billing/InvoicePreview';
import AddNewCardForm from '../Billing/AddNewCardForm';
import CardFooter from '../../components/layout/OnboardingFooter';
import {
  PaymentMethodList_paymentMethodList as PaymentMethod,
  PaymentMethodList,
} from '../../generated/PaymentMethodList';
import addNewCardReducer, { initialNewCardState } from '../../reducers/addNewCardReducer';
import { EDIT_MANY_LANDLORD_PLAN_SUSBCRIPTION } from '../../graphql/queries/server/landlordSubscription';
import {
  EditManyLandlordSubscription,
  EditManyLandlordSubscriptionVariables,
} from '../../generated/EditManyLandlordSubscription';
import {
  REGISTER_PAYMENT_METHOD,
  GET_PAYMENT_METHOD_LIST,
} from '../../graphql/queries/server/billing';
import {
  RegisterPaymentMethod,
  RegisterPaymentMethodVariables,
} from '../../generated/RegisterPaymentMethod';
import toBillingDetails from '../../utils/toBillingDetails';
import { InvoiceList } from './SelectMultipleLandlordPlans';
import { GET_PROPERTIES } from '../../graphql/queries/server/properties';

enum ViewMode {
  NO_CARD,
  EXISTING_CARD,
}

export default function ChangeMultipleLandlordPlansBillingInfo() {
  let history = useHistory();
  let invoiceList: Array<InvoiceList> = history.location.state.invoiceList || [];
  let stripe = useStripe();
  let elements = useElements();
  let { data: paymentListData, loading: paymentListLoading } = useQuery<PaymentMethodList>(
    GET_PAYMENT_METHOD_LIST
  );
  let initialViewMode =
    paymentListData?.paymentMethodList && paymentListData?.paymentMethodList.length > 0
      ? ViewMode.EXISTING_CARD
      : ViewMode.NO_CARD;
  let [selectedViewMode, setSelectedViewMode] = useState(initialViewMode);
  let [state, dispatch] = useReducer(addNewCardReducer, initialNewCardState);
  let [isSaving, setSaving] = useState(false);

  let [editManySubscription, { loading: editManyLoading, error: editManyError }] = useMutation<
    EditManyLandlordSubscription,
    EditManyLandlordSubscriptionVariables
  >(EDIT_MANY_LANDLORD_PLAN_SUSBCRIPTION);

  let [
    registerPaymentMethod,
    { loading: registerPaymentMethodLoading, error: registerPaymentError },
  ] = useMutation<RegisterPaymentMethod, RegisterPaymentMethodVariables>(REGISTER_PAYMENT_METHOD, {
    refetchQueries: [
      {
        query: GET_PAYMENT_METHOD_LIST,
      },
    ],
    awaitRefetchQueries: true,
  });

  let registerCard = async () => {
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
      let registerPaymentResult = await registerPaymentMethod({
        variables: {
          paymentMethodId: result.paymentMethod.id,
        },
      });
      if (registerPaymentResult.data?.registerPaymentMethod?.id) {
        upgradePlan(registerPaymentResult.data?.registerPaymentMethod?.id);
      }
    }
  };

  let upgradePlan = async (paymentMethodId?: string) => {
    let upgradePlanResult = await editManySubscription({
      variables: {
        subscriptionsInput: invoiceList.map((item) => {
          return {
            planId: item.planId,
            spaceId: item.spaceId,
          };
        }),
        paymentMethodId: paymentMethodId || undefined,
      },
      refetchQueries: [{ query: GET_PROPERTIES }],
      awaitRefetchQueries: true,
    });
    if (upgradePlanResult.data?.editManyLandlordSubscription) {
      history.push('/landlord/change-plans/upgrade-success', {
        ...history.location.state,
      });
    }
  };

  let onConfirmPress = () => {
    if (selectedViewMode === ViewMode.NO_CARD) {
      registerCard();
    } else if (selectedViewMode === ViewMode.EXISTING_CARD) {
      upgradePlan();
    }
  };

  let buttonLoading = isSaving && registerPaymentMethodLoading;

  if (editManyLoading || paymentListLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <Container>
        <Title>Enter your billing info</Title>
        <ContactInsemble />
        <Content>
          <ErrorAlert visible={!!registerPaymentError} text={registerPaymentError?.message || ''} />
          <ErrorAlert visible={!!editManyError} text={editManyError?.message || ''} />
          <Text fontSize={FONT_SIZE_MEDIUM} color={THEME_COLOR} style={paddingStyle}>
            Payment Info
          </Text>
          <RowedView>
            {selectedViewMode === ViewMode.EXISTING_CARD ? (
              <ExistingCards
                paymentMethodList={paymentListData?.paymentMethodList || []}
                onUseNewCardPress={() => setSelectedViewMode(ViewMode.NO_CARD)}
              />
            ) : (
              <View flex>
                <AddNewCardForm state={state} dispatch={dispatch} />
                <Button
                  text="Use existing card"
                  mode="transparent"
                  onPress={() => setSelectedViewMode(ViewMode.EXISTING_CARD)}
                  textProps={{ style: { color: DARK_TEXT_COLOR, fontWeight: FONT_WEIGHT_BOLD } }}
                  style={{ alignSelf: 'flex-end' }}
                />
              </View>
            )}
            <Spacing />
            <InvoicePreview subscriptions={invoiceList} />
          </RowedView>
        </Content>
      </Container>
      <CardFooter>
        <BackButton mode="transparent" text="Back" onPress={() => history.goBack()} />
        <Button text="Confirm" onPress={onConfirmPress} loading={buttonLoading} />
      </CardFooter>
    </>
  );
}

type ExistingCardsProps = {
  paymentMethodList: Array<PaymentMethod>;
  onUseNewCardPress: () => void;
};

function ExistingCards({ paymentMethodList, onUseNewCardPress }: ExistingCardsProps) {
  return (
    <View>
      <Text color={THEME_COLOR} style={paddingStyle}>
        Use existing card
      </Text>
      <CreditCardTable paymentMethodList={paymentMethodList} />
      <UseNewCardContainer>
        <Text>or </Text>
        <AddNewCard text="use a new card" mode="transparent" onPress={onUseNewCardPress} />
      </UseNewCardContainer>
    </View>
  );
}

let paddingStyle = { paddingTop: 4, paddingBottom: 4 };

const Container = styled(View)`
  padding: 24px;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_LIGHT};
`;

const RowedView = styled(View)`
  flex-direction: row;
`;

const Content = styled(View)`
  width: 100%;
`;

const UseNewCardContainer = styled(RowedView)`
  align-self: flex-end;
  padding: 4px 0;
`;

const AddNewCard = styled(Button)`
  height: 14px;
  ${Text} {
    color: ${DARK_TEXT_COLOR};
    font-weight: ${FONT_WEIGHT_BOLD};
  }
`;

const BackButton = styled(Button)`
  margin-right: 8px;
  padding: 0 12px;
  ${Text} {
    font-style: italic;
  }
`;

const Spacing = styled(View)`
  width: 24px;
`;

const ErrorAlert = styled(Alert)`
  margin: 4px 0;
`;
