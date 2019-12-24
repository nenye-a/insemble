import React, { ReactNode } from 'react';
import styled from 'styled-components';

import TenantNavbar from '..DELETED_BASE64_STRING';
import MainFooter from '../components/layout/MainFooter';

import { LAYOUT_TYPES } from '../utils/constants';

type Props = {
  children: ReactNode;
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
      <TenantNavbar layout={LAYOUT_TYPES.HEADER_NAVIGATION} />
      {props.children}
      <MainFooter />
    </Container>
  );
}
