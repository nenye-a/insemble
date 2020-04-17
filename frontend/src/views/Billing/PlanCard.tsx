import React from 'react';
import styled from 'styled-components';

import { Card, View, Text as BaseText, Divider } from '../../core-ui';
import { LIGHTER_GREY, THEME_COLOR, DARK_TEXT_COLOR, GREY_DIVIDER } from '../../constants/colors';
import SvgPeopleGroup from '../../components/icons/people-group';
import {
  FONT_SIZE_SMALL,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_LARGE_20,
  FONT_SIZE_XLARGE,
  FONT_WEIGHT_LIGHT,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_BOLD,
} from '../../constants/theme';
import { Role } from '../../types/types';
import { roundDecimal, useCredentials } from '../../utils';

type Props = ViewProps & {
  tierName: string;
  price: number;
  isAnnual: boolean;
};

export default function PlanCard(props: Props) {
  let { tierName, price, isAnnual, ...otherProps } = props;
  let { role } = useCredentials();
  let pricePerMonth = isAnnual ? price / 12 : price;
  let subscriptionSubject = role === Role.TENANT ? 'User' : 'Space';
  let subscriptionDuration = isAnnual ? 'Anual' : 'Monthly';
  let subscriptionDescription = `1 ${subscriptionSubject} | ${subscriptionDuration} Subscription`;

  return (
    <Container {...otherProps}>
      <LeftContainer flex>
        <Text fontSize={FONT_SIZE_LARGE_20} fontWeight={FONT_WEIGHT_BOLD} color={THEME_COLOR}>
          {tierName}
        </Text>
        <Divider mode="horizontal" style={{ width: 70 }} />
        <Text fontSize={FONT_SIZE_XLARGE} fontWeight={FONT_WEIGHT_MEDIUM}>
          ${roundDecimal(pricePerMonth)}
        </Text>
        <Text>USD per month</Text>
        {isAnnual && (
          <Text fontSize={FONT_SIZE_SMALL} fontWeight={FONT_WEIGHT_LIGHT} color={DARK_TEXT_COLOR}>
            paid anually
          </Text>
        )}
      </LeftContainer>
      <RightContainer flex>
        <SvgPeopleGroup />
        <Text
          color={DARK_TEXT_COLOR}
          fontSize={FONT_SIZE_SMALL}
          style={{ paddingTop: 20, paddingBottom: 20 }}
        >
          {subscriptionDescription}
        </Text>
        <Divider color={GREY_DIVIDER} style={{ width: '100%' }} />
        <RowedView>
          <Text fontSize={FONT_SIZE_MEDIUM} fontWeight={FONT_WEIGHT_BOLD}>
            Subtotal
          </Text>
          <Text fontSize={FONT_SIZE_MEDIUM} fontWeight={FONT_WEIGHT_BOLD}>
            ${roundDecimal(price, 2)}
          </Text>
        </RowedView>
      </RightContainer>
    </Container>
  );
}

const Container = styled(Card)`
  flex-direction: row;
  max-width: 560px;
  width: 100%;
  height: 200px;
`;

const LeftContainer = styled(View)`
  align-items: center;
  justify-content: center;
`;

const RightContainer = styled(View)`
  align-items: center;
  justify-content: center;
  background-color: ${LIGHTER_GREY};
  padding: 8px 40px;
`;

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0px;
`;

const Text = styled(BaseText)`
  line-height: 2;
`;
