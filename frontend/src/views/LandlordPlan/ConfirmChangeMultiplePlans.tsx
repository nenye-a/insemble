import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Text, Button } from '../../core-ui';
import { FONT_SIZE_LARGE, FONT_WEIGHT_LIGHT, FONT_SIZE_SMALL } from '../../constants/theme';
import BasePlanCard from '../Billing/PlanCard';
import CardFooter from '../../components/layout/OnboardingFooter';

type Plan = {
  tierName: string;
  price: number;
  isAnnual: boolean;
};

type Props = {
  plans: Array<Plan>;
};

export default function ConfirmChangeMultiplePlans(props: Props) {
  let { plans } = props;
  let history = useHistory();

  return (
    <View>
      <Container>
        <Title>Confirm Plan</Title>
        <Text fontWeight={FONT_WEIGHT_LIGHT} fontSize={FONT_SIZE_SMALL}>
          Questions? Email support@insemblegroup.com
        </Text>
        <PlanCardsWrapper>
          {plans.map(({ tierName, price, isAnnual }, index) => (
            <PlanCard key={index} tierName={tierName} price={price} isAnnual={isAnnual} />
          ))}
        </PlanCardsWrapper>
      </Container>
      <CardFooter>
        <Button
          text="Next"
          onPress={() => {
            history.push('/user/upgrade-plan/confirm-payment', {
              ...history.location.state,
            });
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
