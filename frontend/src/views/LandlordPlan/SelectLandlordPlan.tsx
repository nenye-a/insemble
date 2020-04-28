import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, SegmentedControl } from '../../core-ui';
import TierSubscriptionCard from '../Billing/TierSubscriptionCard';
import { LandlordTiers } from '../../constants/SubscriptionTiers';

type Props = {
  onPlanSelect: (id: string) => void;
};
export default function SelectLandlordPlan(props: Props) {
  let { onPlanSelect } = props;
  let [isAnnual, setIsAnnual] = useState(0);
  let history = useHistory();
  return (
    <Container>
      <SegmentedControl
        options={['Monthly', 'Annually']}
        selectedIndex={isAnnual}
        onPress={(index: number) => {
          setIsAnnual(index);
        }}
        style={{ width: 140 }}
      />

      <CardsContainer>
        {Object.values(LandlordTiers).map(({ name, monthly, yearly, title, benefits }) => {
          return (
            <TierSubscriptionCard
              key={isAnnual ? yearly.id : monthly.id}
              title={title}
              tierName={name}
              benefits={benefits}
              planId={isAnnual ? yearly.id : monthly.id}
              price={isAnnual ? yearly.price : monthly.price}
              // TODO: change to tierType
              isUserCurrentTier={false}
              isAnnual={!!isAnnual}
              onUpgradeButtonPress={() => {
                onPlanSelect(isAnnual ? yearly.id : monthly.id);
                history.push('/landlord/change-plan/select-plan', {
                  planId: isAnnual ? yearly.id : monthly.id,
                  price: isAnnual ? yearly.price : monthly.price,
                  tierName: name,
                  benefits: benefits,
                  ...history.location.state,
                });
              }}
            />
          );
        })}
      </CardsContainer>
    </Container>
  );
}

const Container = styled(View)`
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const CardsContainer = styled(View)`
  padding: 42px 24px;
  flex-direction: row;
`;
