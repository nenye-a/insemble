import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Text, Button } from '../../core-ui';
import { ContactInsemble } from '../../components';
import { FONT_SIZE_LARGE, FONT_WEIGHT_LIGHT } from '../../constants/theme';
import PlanCard from './PlanCard';
import CardFooter from '../../components/layout/OnboardingFooter';

type Props = {
  tierName: string;
  price: number;
  isAnnual: boolean;
};

export default function ConfirmPlanUpgrade(props: Props) {
  let { tierName, price, isAnnual } = props;
  let history = useHistory();

  return (
    <>
      <Container>
        <Title>Confirm Plan Upgrade</Title>
        <ContactInsemble />
        <UpgradePlanCard tierName={tierName} price={price} isAnnual={isAnnual} />
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
    </>
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

const UpgradePlanCard = styled(PlanCard)`
  margin: 36px 0;
`;
