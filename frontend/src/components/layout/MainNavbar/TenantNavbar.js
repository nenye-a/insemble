import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Container, Navbar, NavbarBrand, Col, Badge } from 'shards-react';

import NavbarNav from './NavbarNav/NavbarNav';

import { LAYOUT_TYPES } from '../../../utils/constants';

const TenantNavbar = ({ layout, stickyTop }) => {
  const isHeaderNav = layout === LAYOUT_TYPES.HEADER_NAVIGATION;
  const classes = classNames('main-navbar', 'bg-white', stickyTop && 'sticky-top');

  const sessionText = () => {
    if (sessionStorage.getItem('sessionIncome')) {
      const income = parseInt(sessionStorage.getItem('sessionIncome'), 10);
      const categories = JSON.parse(sessionStorage.getItem('sessionTags'));

      return (
        <div className="d-table my-auto">
          <Col className="d-none d-md-inline ml-1">Recent Search Income: ${income}</Col>
          <Col className="d-none d-md-inline ml-1">Recent Search Categories: </Col>
          <Col className="d-none d-md-inline ml-1">
            {categories.map((category, idx) => (
              <Badge
                pill
                theme="light"
                className="text-light text-uppercase mb-2 border mr-1"
                key={idx}
              >
                {category}
              </Badge>
            ))}
          </Col>
        </div>
      );
    } else if (sessionStorage.getItem('sessionStoreName')) {
      const storeName = sessionStorage.getItem('sessionStoreName');
      const address = sessionStorage.getItem('sessionAddress');

      return (
        <div className="d-table my-auto">
          <Col className="d-none d-md-inline ml-1">Recent Search: {storeName}</Col>
          <Col className="d-none d-md-inline ml-1">Input Address: {address}</Col>
        </div>
      );
    }
  };

  return (
    <div className={classes}>
      <Container fluid className="p-0">
        <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
          {isHeaderNav && (
            <NavbarBrand href="/" style={{ lineHeight: '20px' }}>
              <div className="d-table m-auto">
                <img
                  id="main-logo"
                  className="d-inline-block align-top mr-1 ml-3"
                  style={{ maxHeight: '20px' }}
                  src="https://d3v63q50apccnu.cloudfront.net/insemble_i.png"
                  alt="Insemble"
                />
                <span className="d-none d-md-inline ml-1">Insemble</span>
              </div>
            </NavbarBrand>
          )}
          {/* <ButtonGroup size="sm" className="my-auto d-inline-flex mb-sm-auto mx-auto">
            <Button theme="white" tag={NavLink} to="/insights">
              Grid
            </Button>
            <Button theme="white" tag={NavLink} to="/spaces">
              Map
            </Button>
          </ButtonGroup> */}
          {/* Filler div */}
          {/* <div className="w-100 d-none d-md-flex d-lg-flex" /> */}
          {/* <div>
            <span className="d-none d-md-inline ml-1">Current Search: </span>
          </div> */}
          {sessionText()}
          <NavbarNav />
        </Navbar>
      </Container>
    </div>
  );
};

TenantNavbar.propTypes = {
  /**
   * The layout type where the TenantNavbar is used.
   */
  layout: PropTypes.string,
  /**
   * Whether the main navbar is sticky to the top, or not.
   */
  stickyTop: PropTypes.bool,
};

TenantNavbar.defaultProps = {
  stickyTop: true,
};

export default TenantNavbar;
