import React, { useState } from 'react';
import styled from 'styled-components';

import { View, SegmentedControl, Button } from '../../core-ui';
import CardFooter from '../../components/layout/OnboardingFooter';
import TierSubscriptionCard from '../Billing/TierSubscriptionCard';
import { LandlordTiers } from '../../constants/SubscriptionTiers';

export default function ViewLandlordPlans() {
  let [isAnnual, setIsAnnual] = useState(0);

  return (
    <>
      <Container>
        <SegmentedControl
          options={['Monthly', 'Anually']}
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
                isAnnual={!!isAnnual}
                planId={isAnnual ? yearly.id : monthly.id}
                price={isAnnual ? yearly.price : monthly.price}
                // TODO: change to tierType
                isUserCurrentTier={false}
              />
            );
          })}
        </CardsContainer>
      </Container>
      <CardFooter>
        <Button
          text="Next"
          onPress={() => {
            // TODO: navigate to next page
          }}
        />
      </CardFooter>
    </>
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
