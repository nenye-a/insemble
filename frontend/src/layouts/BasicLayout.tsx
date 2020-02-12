import React, { ReactNode } from 'react';
import styled from 'styled-components';

import HeaderNavigationBar from '../components/layout/HeaderNavigationBar';

type Props = {
  children: ReactNode;
  showButton?: boolean;
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Layout with header and footer
export default function BasicLayout(props: Props) {
  return (
    <Container>
      <HeaderNavigationBar showButton={props.showButton} />
      {props.children}
    </Container>
  );
}
