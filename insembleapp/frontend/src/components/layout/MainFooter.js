import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Nav, NavItem, NavLink } from 'shards-react';
import { Link } from 'react-router-dom';

const MainFooter = ({ contained, menuItems, copyright }) => (
  <footer className="main-footer d-flex p-2 px-3 bg-white border-top">
    <Container fluid={contained}>
      <Row>
        <Nav>
          <NavItem>
            <NavLink tag={Link} to={'/explain'} className="px-3">
              {'Help'}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to={'/feedback'} className="px-3">
              {'Feedback'}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to={'/describe-store'} className="px-3">
              {'Find Matches by Category'}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to={'/existing'} className="px-3">
              {'Find Matches for Existing Store'}
            </NavLink>
          </NavItem>
        </Nav>
        <span className="copyright ml-auto my-auto mr-2">{copyright}</span>
      </Row>
    </Container>
  </footer>
);

MainFooter.propTypes = {
  /**
   * Whether the content is contained, or not.
   */
  contained: PropTypes.bool,
  /**
   * The menu items array.
   */
  menuItems: PropTypes.array,
  /**
   * The copyright info.
   */
  copyright: PropTypes.string,
};

MainFooter.defaultProps = {
  contained: false,
  copyright: 'Copyright © 2019 Insemble',
  menuItems: [
    {
      title: 'About',
      to: '/explain',
    },
    {
      title: 'Enter Another Store',
      to: '/find',
    },
    {
      title: 'Save Current Search',
      to: '/login',
    },
  ],
};

export default MainFooter;
