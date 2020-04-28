import React, { useState, useReducer } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { View, Text, Button, LoadingIndicator, Alert } from '../../core-ui';
import { ContactInsemble } from '../../components';
import CreditCardTable from '../Billing/CreditCardTable';
import InvoicePreview from '../Billing/InvoicePreview';
import AddNewCardForm from '../Billing/AddNewCardForm';
import CardFooter from '../../components/layout/OnboardingFooter';
import addNewCardReducer, { initialNewCardState } from '../../reducers/addNewCardReducer';
import { toBillingDetails } from '../../utils';
import {
  FONT_WEIGHT_LIGHT,
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  FONT_WEIGHT_BOLD,
} from '../../constants/theme';
import { THEME_COLOR, DARK_TEXT_COLOR } from '../../constants/colors';
import {
  REGISTER_PAYMENT_METHOD,
  GET_PAYMENT_METHOD_LIST,
} from '../../graphql/queries/server/billing';
import {
  GET_LANDLORD_SUBSCRIPTIONS_LIST,
  CREATE_LANDLORD_PLAN_SUBSCRIPTION,
  EDIT_LANDLORD_PLAN_SUBSCRIPTION,
} from '../../graphql/queries/server/landlordSubscription';
import { GET_SPACE } from '../../graphql/queries/server/space';
import { PaymentMethodList_paymentMethodList as PaymentMethod } from '../../generated/PaymentMethodList';
import {
  RegisterPaymentMethod,
  RegisterPaymentMethodVariables,
} from '../../generated/RegisterPaymentMethod';
import {
  CreateLandlordSubscription,
  CreateLandlordSubscriptionVariables,
} from '../../generated/CreateLandlordSubscription';
import {
  EditLandlordSubscription,
  EditLandlordSubscriptionVariables,
} from '../../generated/EditLandlordSubscription';
import { GetSpace } from '../../generated/GetSpace';

type Props = {
  paymentMethodList: Array<PaymentMethod>;
  tierName: string;
  price: number;
  isAnnual: boolean;
  planId: string;
  spaceId: string;
};

enum ViewMode {
  NO_CARD,
  EXISTING_CARD,
}

export default function EnterBillingInfo(props: Props) {
  let { paymentMethodList, tierName, price, isAnnual, planId, spaceId } = props;
  let [state, dispatch] = useReducer(addNewCardReducer, initialNewCardState);
  let history = useHistory();
  let stripe = useStripe();
  let elements = useElements();
  let initialViewMode = paymentMethodList.length > 0 ? ViewMode.EXISTING_CARD : ViewMode.NO_CARD;
  let [selectedViewMode, setSelectedViewMode] = useState(initialViewMode);
  let [isSaving, setSaving] = useState(false);
  let [registerPaymentMethod, { loading: registerPaymentMethodLoading }] = useMutation<
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
  let [
    createLandlordPlan,
    { loading: createLandlordPlanLoading, error: createLandlordPlanError },
  ] = useMutation<CreateLandlordSubscription, CreateLandlordSubscriptionVariables>(
    CREATE_LANDLORD_PLAN_SUBSCRIPTION,
    {
      refetchQueries: [
        {
          query: GET_LANDLORD_SUBSCRIPTIONS_LIST,
        },
      ],
      awaitRefetchQueries: true,
    }
  );

  let [
    editLandlordPlan,
    { loading: editLandlordPlanLoading, error: editLandlordPlanError },
  ] = useMutation<EditLandlordSubscription, EditLandlordSubscriptionVariables>(
    EDIT_LANDLORD_PLAN_SUBSCRIPTION
  );

  let { data: spaceData, loading: spaceLoading } = useQuery<GetSpace>(GET_SPACE);
  let onConfirmPress = async () => {
    if (selectedViewMode === ViewMode.NO_CARD) {
      registerCard();
    } else if (selectedViewMode === ViewMode.EXISTING_CARD) {
      upgradePlan();
    }
  };

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
    if (spaceData?.space.stripeSubscriptionId) {
      let upgradePlanResult = await editLandlordPlan({
        variables: {
          planId,
          spaceId,
          paymentMethodId: paymentMethodId || undefined,
        },
      });
      if (upgradePlanResult.data?.createLandlordSubscription) {
        history.push('/user/upgrade-plan/upgrade-success', {
          ...history.location.state,
        });
      }
    } else {
      let upgradePlanResult = await createLandlordPlan({
        variables: {
          planId,
          spaceId,
          paymentMethodId: paymentMethodId || undefined,
        },
      });
      if (upgradePlanResult.data?.createLandlordSubscription) {
        history.push('/user/upgrade-plan/upgrade-success', {
          ...history.location.state,
        });
      }
    }
  };

  let buttonLoading = isSaving && registerPaymentMethodLoading;

  if (createLandlordPlanLoading || editLandlordPlanLoading || spaceLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <Container>
        <Title>Enter your billing info</Title>
        <ContactInsemble />
        <Content>
          <ErrorAlert
            visible={!!createLandlordPlanError}
            text={createLandlordPlanError?.message || ''}
          />
          <ErrorAlert
            visible={!!editLandlordPlanError}
            text={editLandlordPlanError?.message || ''}
          />
          <Text fontSize={FONT_SIZE_MEDIUM} color={THEME_COLOR} style={paddingStyle}>
            Payment Info
          </Text>
          <RowedView>
            {selectedViewMode === ViewMode.EXISTING_CARD && paymentMethodList.length > 0 ? (
              <ExistingCards
                paymentMethodList={paymentMethodList}
                onUseNewCardPress={() => setSelectedViewMode(ViewMode.NO_CARD)}
              />
            ) : (
              <View flex>
                <AddNewCardForm state={state} dispatch={dispatch} />
                {paymentMethodList.length > 0 && (
                  <Button
                    text="Use existing card"
                    mode="transparent"
                    onPress={() => setSelectedViewMode(ViewMode.EXISTING_CARD)}
                    textProps={{ style: { color: DARK_TEXT_COLOR, fontWeight: FONT_WEIGHT_BOLD } }}
                    style={{ alignSelf: 'flex-end' }}
                  />
                )}
              </View>
            )}
            <Spacing />
            <InvoicePreview subscriptions={[{ tierName, price, isAnnual }]} />
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
