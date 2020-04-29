import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import {
  THEME_COLOR,
  WHITE,
  HIGHLIGHTED_BANNER_BACKGROUND,
  SUBSCRIBE_BUTTON_COLOR,
} from '../../constants/colors';
import { View, Text, Button } from '../../core-ui';
import { GET_USER_STATE } from '../../graphql/queries/client/userState';
import { TenantTier } from '../../generated/globalTypes';
import { useCredentials } from '../../utils';
import { Role } from '../../types/types';

export default function FreeTrialBanner() {
  let { data, refetch } = useQuery(GET_USER_STATE, {
    notifyOnNetworkStatusChange: true,
  });
  let history = useHistory();
  useEffect(() => {
    let { tier, trial } = data.userState;
    if (!tier || !trial) {
      refetch();
    }
  }, [data.userState, refetch]);
  let { role } = useCredentials();
  let { tier, trial } = data.userState;
  let isFreeTier = !trial || tier === TenantTier.FREE;
  let location =
    role === Role.TENANT ? '/user/plan' : role === Role.LANDLORD ? '/landlord/billing' : '/';
  return (
    <Container>
      <StatusContainer flex>
        <BannerText>{isFreeTier ? `Free Trial` : `Full Platform`}</BannerText>
      </StatusContainer>
      <Row flex>
        <BannerText>Service only available for Los Angeles and Orange County</BannerText>
        {isFreeTier ? (
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
