import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Text, Button } from '../../core-ui';
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
import { PaymentMethodList_paymentMethodList as PaymentMethod } from '../../generated/PaymentMethodList';
import { ContactInsemble } from '../../components';

type Plan = { tierName: string; price: number; isAnnual: boolean };

type Props = {
  paymentMethodList: Array<PaymentMethod>;
  plans: Array<Plan>;
};

enum ViewMode {
  NO_CARD,
  EXISTING_CARD,
}

export default function ChangeMultipleLandlordPlansBillingInfo(props: Props) {
  let { paymentMethodList, plans } = props;
  let history = useHistory();
  let initialViewMode = paymentMethodList.length > 0 ? ViewMode.EXISTING_CARD : ViewMode.NO_CARD;
  let [selectedViewMode, setSelectedViewMode] = useState(initialViewMode);

  return (
    <>
      <Container>
        <Title>Enter your billing info</Title>
        <ContactInsemble />
        <Content>
          <Text fontSize={FONT_SIZE_MEDIUM} color={THEME_COLOR} style={paddingStyle}>
            Payment Info
          </Text>
          <RowedView>
            {selectedViewMode === ViewMode.EXISTING_CARD ? (
              <ExistingCards
                paymentMethodList={paymentMethodList}
                onUseNewCardPress={() => setSelectedViewMode(ViewMode.NO_CARD)}
              />
            ) : (
              <View flex>
                <AddNewCardForm showSaveButton={false} />
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
            <InvoicePreview subscriptions={plans} />
          </RowedView>
        </Content>
      </Container>
      <CardFooter>
        <BackButton mode="transparent" text="Back" onPress={() => history.goBack()} />
        <Button
          text="Confirm"
          onPress={() => {
            // connect be
          }}
        />
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
