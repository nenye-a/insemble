import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Container, Navbar, NavbarBrand, ButtonGroup, Button } from 'shards-react';

import { NavLink } from 'react-router-dom';
import NavbarNav from './NavbarNav/NavbarNav';
import NavbarToggle from './NavbarToggle';

import { LAYOUT_TYPES } from '../../../utils/constants';

const TenantNavbar = ({ layout, stickyTop }) => {
  const isHeaderNav = layout === LAYOUT_TYPES.HEADER_NAVIGATION;
  const classes = classNames('main-navbar', 'bg-white', stickyTop && 'sticky-top');

  return (
    <div className={classes}>
      <Container fluid className="p-0">
        <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
          {isHeaderNav && (
            <NavbarBrand href="/spaces" style={{ lineHeight: '25px' }}>
              <div className="d-table m-auto">
                <img
                  id="main-logo"
                  className="d-inline-block align-top mr-1 ml-3"
                  style={{ maxHeight: '25px' }}
                  src={require('../../../images/insemble_i.png')}
                  alt="Owner Dashboard"
                />
                <span className="d-none d-md-inline ml-1">Insemble.ai</span>
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
          <div className="w-100 d-none d-md-flex d-lg-flex" />
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
