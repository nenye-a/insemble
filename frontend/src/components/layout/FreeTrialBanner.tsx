import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import { THEME_COLOR, WHITE, HIGHLIGHTED_BANNER_BACKGROUND } from '../../constants/colors';
import { View, Text, Button } from '../../core-ui';
import { GET_TIER } from '../../graphql/queries/client/userState';
import { TenantTier } from '../../generated/globalTypes';

export default function FreeTrialBanner() {
  let { data } = useQuery(GET_TIER);
  let history = useHistory();
  let isFreeTier = data.userState.tier === TenantTier.FREE;
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
            onPress={() => history.push('/user/plan')}
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
  background-color: #ece9f8;
  ${Text} {
    color: ${THEME_COLOR};
  }
`;
