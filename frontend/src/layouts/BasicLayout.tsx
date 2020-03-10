import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { View } from '../core-ui';

import HeaderNavigationBar from '../components/layout/HeaderNavigationBar';
import FreeTrialBanner from '../components/layout/FreeTrialBanner';
import { GET_LOCATION_PREVIEW_ERROR } from '../graphql/queries/client/matches';
import { ErrorState } from '../graphql/localState';

type Props = {
  children: ReactNode;
  showButton?: boolean;
  showBanner?: boolean;
};

const Container = styled(View)`
  min-height: 100vh;
`;

// Layout with header and footer
export default function BasicLayout(props: Props) {
  let { showBanner, showButton } = props;
  let { data } = useQuery<ErrorState>(GET_LOCATION_PREVIEW_ERROR);

  return (
    <Container>
      {showBanner && <FreeTrialBanner error={data?.errorState.locationPreview || false} />}
      <HeaderNavigationBar showButton={showButton} />
      {props.children}
    </Container>
  );
}
