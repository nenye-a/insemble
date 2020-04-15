import React from 'react';
import styled, { css } from 'styled-components';

import { View, Text, Button } from '../../core-ui';
import { WHITE, THEME_COLOR, SECONDARY_COLOR } from '../../constants/colors';
import {
  FONT_SIZE_SMALL,
  FONT_SIZE_LARGE,
  FONT_SIZE_XXXLARGE,
  DEFAULT_BORDER_RADIUS,
} from '../../constants/theme';
import getUnit from './helpers/getUnit';

type TierSubscriptionProps = {
  title?: string;
  tierName: string;
  benefits: Array<string>;
  price: number;
  isAnnual: boolean;
  planId: string;
  isUserCurrentTier: boolean;
  onPress?: (id: string) => void;
  onUpgradeButtonPress?: () => void;
};

export default function TierSubscription(props: TierSubscriptionProps) {
  let {
    price,
    isAnnual,
    benefits,
    isUserCurrentTier,
    tierName,
    title = '',
    onUpgradeButtonPress,
  } = props;

  return (
    <TierSubscriptionWrapper>
      <Content>
        {title && (
          <TitleContainer>
            <Text color={WHITE}>{title}</Text>
          </TitleContainer>
        )}
        <TypeWrapper hasTitle={!!title}>
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
          {benefits.map((text, index) => (
            <BenefitItem benefit={text} key={index} />
          ))}
        </PlanSection>
      </Content>

      {onUpgradeButtonPress && (
        <UpgradeButton text="Upgrade" onPress={onUpgradeButtonPress} disabled={isUserCurrentTier} />
      )}
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

type TypeWrapperProps = ViewProps & {
  hasTitle: boolean;
};
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
  border-bottom-left-radius: ${DEFAULT_BORDER_RADIUS};
  border-bottom-right-radius: ${DEFAULT_BORDER_RADIUS};
  flex: 1;
`;
const PriceText = styled(Text)`
  text-align: center;
  font-size: ${FONT_SIZE_XXXLARGE};
  font-weight: 500;
  line-height: 1.5;
`;
const TypeWrapper = styled(View)<TypeWrapperProps>`
  justify-content: center;
  align-items: center;
  background-color: #fafafa;
  ${(props) =>
    props.hasTitle &&
    css`
      border-top-left-radius: ${DEFAULT_BORDER_RADIUS};
      border-top-right-radius: ${DEFAULT_BORDER_RADIUS};
    `}
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
const TitleContainer = styled(View)`
  background-color: ${THEME_COLOR};
  border-top-left-radius: ${DEFAULT_BORDER_RADIUS};
  border-top-right-radius: ${DEFAULT_BORDER_RADIUS};
  position: absolute;
  z-index: 1;
  top: -26px;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 26px;
`;
const Content = styled(View)`
  box-shadow: 0px 0px 23px -11px rgba(0, 0, 0, 0.75);
  border-radius: ${DEFAULT_BORDER_RADIUS};
  height: 300px;
`;
const TierSubscriptionWrapper = styled(View)`
  margin-right: 12px;
  &:last-child {
    margin-right: 0px;
  }
  &:hover {
    cursor: pointer;
    ${UpgradeButton}:enabled {
      background-color: ${THEME_COLOR};
    }
  }
`;
