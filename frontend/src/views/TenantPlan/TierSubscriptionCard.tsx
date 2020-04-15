import React from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';

import { View, Text, Button } from '../../core-ui';
import CardContainer, { CardTitleContainer } from './CardContainer';
import { WHITE, THEME_COLOR, SECONDARY_COLOR } from '../../constants/colors';
import { FONT_SIZE_SMALL, FONT_SIZE_LARGE, FONT_SIZE_XXXLARGE } from '../../constants/theme';
import getUnit from './helpers/getUnit';

type TierSubscriptionProps = {
  title: string;
  tierName: string;
  benefits: Array<string>;
  price: number;
  isAnnual: boolean;
  planId: string;
  isUserCurrentTier: boolean;
  onPress: (id: string) => void;
};

export default function TierSubscription(props: TierSubscriptionProps) {
  let { price, isAnnual, benefits, isUserCurrentTier, tierName, title, planId } = props;
  let history = useHistory();
  let location = useLocation();

  return (
    <TierSubscriptionWrapper>
      <CardContainer title={title}>
        <TypeWrapper>
          <TypeText>{tierName}</TypeText>
        </TypeWrapper>
        <PlanSection>
          <PlanPrice>
            {price === 0 ? (
              <PriceText>{tierName}</PriceText>
            ) : (
              <PlanPriceContainer>
                <PlanTitleText>Starting at</PlanTitleText>
                <PlanPriceTextContainer>
                  <PriceText>
                    ${price}
                    <Text>/{getUnit(isAnnual)}</Text>
                  </PriceText>
                </PlanPriceTextContainer>
              </PlanPriceContainer>
            )}
          </PlanPrice>
          <View>
            {benefits.map((text, index) => (
              <BenefitItem benefit={text} key={index} />
            ))}
          </View>
        </PlanSection>
      </CardContainer>
      <UpgradeButton
        text="Upgrade"
        onPress={() => {
          history.push('/user/upgrade-plan/confirm-plan', {
            background: location,
            planId,
            tierName,
            price,
            isAnnual,
          });
        }}
        disabled={isUserCurrentTier}
      />
    </TierSubscriptionWrapper>
  );
}

function BenefitItem({ benefit }: { benefit: string }) {
  return (
    <BenefitItemContainer>
      <BenefitCheck>✓</BenefitCheck>
      <BenefitItemText>{benefit}</BenefitItemText>
    </BenefitItemContainer>
  );
}

const PlanTitleText = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
`;

const PlanPriceContainer = styled(View)`
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const PlanPriceTextContainer = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
`;

const PlanPrice = styled(View)`
  height: 100px;
  margin-bottom: 37px;
  justify-content: center;
`;
const BenefitCheck = styled(View)`
  margin-right: 12px;
`;
const BenefitItemContainer = styled(View)`
  flex-direction: row;
  flex: 1;
  align-items: baseline;
`;
const BenefitItemText = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
  margin-bottom: 14;
  color: #7c7c7c;
`;
const PlanSection = styled(View)`
  padding: 0 16px 32px;
  background-color: white;
  border-bottom-left-radius: 5;
  border-bottom-right-radius: 5;
  flex: 1;
`;
const PriceText = styled(Text)`
  text-align: center;
  font-size: ${FONT_SIZE_XXXLARGE};
  font-weight: 500;
  line-height: 1;
`;
const TypeWrapper = styled(View)`
  justify-content: center;
  align-items: center;
  background-color: #fafafa;
`;
const TypeText = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  font-weight: 700;
  padding: 6px 0;
`;
const UpgradeButton = styled(Button)`
  background-color: ${SECONDARY_COLOR};
  color: ${WHITE};
  margin-top: 12px;
  cursor: pointer;
`;
const TierSubscriptionWrapper = styled(View)`
  margin-right: 12px;
  &:last-child {
    margin-right: 0px;
  }
  &:hover {
    cursor: pointer;
    ${CardTitleContainer} {
      background-color: ${THEME_COLOR};
    }
    ${UpgradeButton}:enabled {
      background-color: ${THEME_COLOR};
    }
  }
`;
