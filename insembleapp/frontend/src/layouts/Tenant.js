import React from "react";
import { Container, Row, Col } from "shards-react";

import TenantNavbar from "..DELETED_BASE64_STRING";
import HeaderNavbar from "..DELETED_BASE64_STRING";
import MainFooter from "../components/layout/MainFooter";

import { LAYOUT_TYPES } from "../utils/constants";
import getHeaderNavbarItems from "../data/header-nav-items";

export default ({ children }) => (
  <Container fluid>
    <Row>
      <Col tag="main" className="main-content p-0" lg="12" md="12" sm="12">
        <TenantNavbar layout={LAYOUT_TYPES.HEADER_NAVIGATION} />
          {children}
        <MainFooter />
      </Col>
    </Row>
  </Container>
);
