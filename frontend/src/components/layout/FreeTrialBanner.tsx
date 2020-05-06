import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import {
  THEME_COLOR,
  WHITE,
  HIGHLIGHTED_BANNER_BACKGROUND,
  SUBSCRIBE_BUTTON_COLOR,
} from '../../constants/colors';
import { View, Text, Button } from '../../core-ui';
import { useCredentials } from '../../utils';
import { Role } from '../../types/types';
import { useGetUserState } from '../../utils/hooks/useGetUserState';

export default function FreeTrialBanner() {
  let history = useHistory();
  let { tier, trial, isTenantFreeTier, refetch } = useGetUserState();
  useEffect(() => {
    if (!tier || !trial) {
      refetch();
    }
  }, [refetch, tier, trial]);
  let { role } = useCredentials();
  let location =
    role === Role.TENANT ? '/user/plan' : role === Role.LANDLORD ? '/landlord/billing' : '/';
  return (
    <Container>
      <StatusContainer flex>
        <BannerText>
          {trial ? `Free Trial` : isTenantFreeTier ? `On Free Plan` : `Full Platform`}
        </BannerText>
      </StatusContainer>
      <Row flex>
        <BannerText>Service only available for Los Angeles and Orange County</BannerText>
        {trial ? (
          <SubscribeButton
            size="small"
            text="Subscribe Now"
            onPress={() => history.push(location)}
          />
        ) : null}
      </Row>
    </Container>
  );
}

type ContainerProps = ViewProps & {
  highlight: boolean;
};

const Container = styled(View)<ContainerProps>`
  height: 50px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  background-color: ${(props) => (props.highlight ? HIGHLIGHTED_BANNER_BACKGROUND : THEME_COLOR)};
`;

const BannerText = styled(Text)`
  color: ${WHITE};
`;

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
  margin: 0 24px;
  justify-content: flex-end;
`;

const StatusContainer = styled(View)`
  margin: 0 24px;
`;

const SubscribeButton = styled(Button)`
  margin: 0 0 0 24px;
  background-color: ${SUBSCRIBE_BUTTON_COLOR};
  ${Text} {
    color: ${THEME_COLOR};
  }
`;
