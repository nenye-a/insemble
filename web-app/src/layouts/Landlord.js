import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import LandlordSidebar from "../components/layout/LandlordSidebar/LandlordSidebar";
import MainFooter from "../components/layout/MainFooter";

const LandlordLayout = ({ children, noNavbar, noFooter }) => (
  <Container fluid>
    <Row>
      <LandlordSidebar />
      <Col
        className="main-content p-0"
        lg={{ size: 10, offset: 2 }}
        md={{ size: 9, offset: 3 }}
        sm="12"
        tag="main"
      >
        {!noNavbar && <MainNavbar />}
        {children}
        {!noFooter && <MainFooter />}
      </Col>
    </Row>
  </Container>
);

LandlordLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

LandlordLayout.defaultProps = {
  noNavbar: false,
  noFooter: false
};

export default LandlordLayout;
