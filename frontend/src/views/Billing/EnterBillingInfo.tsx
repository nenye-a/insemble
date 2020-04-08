import React from 'react';
import styled from 'styled-components';

import { View, Text, Button } from '../../core-ui';
import {
  FONT_WEIGHT_LIGHT,
  FONT_SIZE_SMALL,
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  FONT_WEIGHT_BOLD,
} from '../../constants/theme';
import { SUPPORT_EMAIL } from '../../constants/app';
import { THEME_COLOR, DARK_TEXT_COLOR } from '../../constants/colors';
import CreditCardTable from './CreditCardTable';
import InvoicePreview from './InvoicePreview';
import CardFooter from '../../components/layout/OnboardingFooter';

export default function EnterBillingInfo() {
  return (
    <>
      <Container>
        <Title>Enter your billing info</Title>
        <Text fontWeight={FONT_WEIGHT_LIGHT} fontSize={FONT_SIZE_SMALL}>
          Questions? Email {SUPPORT_EMAIL}
        </Text>
        <View>
          <Text fontSize={FONT_SIZE_MEDIUM} color={THEME_COLOR} style={paddingStyle}>
            Payment Info
          </Text>
          <RowedView>
            <ExistingCards />
            <InvoicePreview
              subscriptions={[{ tierName: 'Professional', price: 300, isAnnual: true }]}
            />
          </RowedView>
        </View>
      </Container>
      <CardFooter>
        <BackButton mode="transparent" text="Back" />
        <Button text="Next" />
      </CardFooter>
    </>
  );
}

function ExistingCards() {
  return (
    <>
      <LeftContainer>
        <Text color={THEME_COLOR} style={paddingStyle}>
          Use existing card
        </Text>
        <CreditCardTable
          paymentMethodList={[
            {
              __typename: 'CustomerPaymentMethod',
              id: '1',
              expMonth: 9,
              expYear: 2022,
              lastFourDigits: '4111',
              isDefault: true,
            },
            {
              __typename: 'CustomerPaymentMethod',
              id: '2',
              expMonth: 9,
              expYear: 2022,
              lastFourDigits: '1232',
              isDefault: false,
            },
          ]}
        />
        <UseNewCardContainer>
          <Text>or </Text>
          <AddNewCard text="use a new card" mode="transparent" />
        </UseNewCardContainer>
      </LeftContainer>
    </>
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

const LeftContainer = styled(View)`
  align-items: flex-start;
  margin-right: 24px;
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
