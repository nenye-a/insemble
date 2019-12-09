import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'shards-react';

import MainNavbar from '..DELETED_BASE64_STRING';
import LandlordSidebar from '..DELETED_BASE64_STRING';
import MainFooter from '../components/layout/MainFooter';

const LoginLayout = ({ children, noNavbar, noFooter }) => (
  // <Container fluid>
    <Row>
      <Col className="main-content" sm="12" tag="main">
        {children}
      </Col>
    </Row>
  // </Container>
);

LoginLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool,
};

LoginLayout.defaultProps = {
  noNavbar: false,
  noFooter: false,
};

export default LoginLayout;
