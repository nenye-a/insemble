import React from 'react';
import { Container, Row, Col } from 'shards-react';

import TenantNavbar from '../components/layout/MainNavbar/TenantNavbar';
import MainFooter from '../components/layout/MainFooter';

import { LAYOUT_TYPES } from '../utils/constants';

// Layout with header and footer
export default function BasicLayout(props) {
  return (
    <Container fluid className="p-0 main-content">
      <TenantNavbar layout={LAYOUT_TYPES.HEADER_NAVIGATION} />
      {props.children}
      <MainFooter />
    </Container>
  );
}
