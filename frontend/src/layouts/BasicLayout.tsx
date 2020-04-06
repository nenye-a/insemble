import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { View } from '../core-ui';

import HeaderNavigationBar from '../components/layout/HeaderNavigationBar';
import FreeTrialBanner from '../components/layout/FreeTrialBanner';

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

  return (
    <Container>
      {showBanner && <FreeTrialBanner />}
      <HeaderNavigationBar showButton={showButton} />
      {props.children}
    </Container>
  );
}
