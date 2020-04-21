import React from 'react';
import styled from 'styled-components';

import { Card, Text as BaseText, Divider, View } from '../../core-ui';
import { useCredentials, roundDecimal } from '../../utils';
import { LIGHTER_GREY, GREY_DIVIDER } from '../../constants/colors';
import { FONT_WEIGHT_MEDIUM, FONT_SIZE_SMALL } from '../../constants/theme';
import { Role } from '../../types/types';

type Subscription = { tierName: string; price: number; isAnnual: boolean };

type Props = {
  subscriptions: Array<Subscription>;
};
export default function InvoicePreview(props: Props) {
  let { subscriptions } = props;
  let { role } = useCredentials();
  let total = subscriptions.reduce((accumulator, sub) => accumulator + sub.price, 0);
  return (
    <Container>
      <Title>Invoice Preview</Title>
      <Divider color={GREY_DIVIDER} />
      <SubscriptionsContainer>
        {subscriptions.map((subscription, index) => {
          let { tierName, price, isAnnual } = subscription;
          let pricePerMonth = isAnnual ? price / 12 : price;
          let subscriptionSubject = role === Role.TENANT ? 'user' : 'space';
          let subscriptionDuration = isAnnual ? 'anually' : 'monthly';
          let subscriptionDescription = `(${roundDecimal(
            pricePerMonth
          )} USD per month, paid ${subscriptionDuration})`;

          return (
            <SubscriptionItem key={index}>
              <RowedView>
                <Text>{tierName}</Text>
                <Text>${price}</Text>
              </RowedView>
              <Text>{subscriptionDescription}</Text>
              <Text>1 {subscriptionSubject}</Text>
            </SubscriptionItem>
          );
        })}
      </SubscriptionsContainer>
      <Divider color={GREY_DIVIDER} />
      <RowedView>
        <TotalText>Total</TotalText>
        <TotalText>${total}</TotalText>
      </RowedView>
    </Container>
  );
}

const Container = styled(Card)`
  padding: 12px;
  background-color: ${LIGHTER_GREY};
  width: 250px;
  height: 280px;
`;

const RowedView = styled(View)`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`;

const Text = styled(BaseText)`
  font-size: ${FONT_SIZE_SMALL};
`;

const Title = styled(Text)`
  padding-bottom: 8px;
`;

const TotalText = styled(Text)`
  font-weight: ${FONT_WEIGHT_MEDIUM};
  padding-top: 8px;
`;

const SubscriptionItem = styled(View)`
  padding: 8px 0;
`;

const SubscriptionsContainer = styled(View)`
  height: 200px;
  overflow-y: scroll;
`;
