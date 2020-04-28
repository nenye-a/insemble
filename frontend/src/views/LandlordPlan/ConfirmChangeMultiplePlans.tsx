import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Text, Button } from '../../core-ui';
import { ContactInsemble } from '../../components';
import { FONT_SIZE_LARGE, FONT_WEIGHT_LIGHT } from '../../constants/theme';
import BasePlanCard from '../Billing/PlanCard';
import CardFooter from '../../components/layout/OnboardingFooter';
import { InvoiceList } from './SelectMultipleLandlordPlans';

export default function ConfirmChangeMultiplePlans() {
  let history = useHistory();
  let invoiceList: Array<InvoiceList> = history.location.state.invoiceList || [];
  return (
    <View>
      <Container>
        <Title>Confirm Plan</Title>
        <ContactInsemble />
        <PlanCardsWrapper>
          {invoiceList.map(({ tierName, price, isAnnual }, index) => (
            <PlanCard key={index} tierName={tierName} price={price} isAnnual={isAnnual} />
          ))}
        </PlanCardsWrapper>
      </Container>
      <CardFooter>
        <BackButton
          text="Back"
          mode="transparent"
          onPress={() => {
            history.goBack();
          }}
        />
        <Button
          text="Next"
          onPress={() => {
            history.push('/landlord/change-plans/confirm-payment', { invoiceList });
          }}
        />
      </CardFooter>
    </View>
  );
}

const Container = styled(View)`
  padding: 12px 24px;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_LIGHT};
  padding-top: 12px;
`;

const PlanCard = styled(BasePlanCard)`
  width: 100%;
  margin-bottom: 12px;
  height: 154px;
  &:last-child {
    margin: 0;
  }
`;

const PlanCardsWrapper = styled(View)`
  padding: 12px 0;
  align-items: center;
  overflow-y: scroll;
  height: 300px;
  width: 100%;
`;

const BackButton = styled(Button)`
  margin-right: 8px;
  padding: 0 12px;
`;
