import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Button,
  Slider,
  Collapse,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Dropdown,
  NavItem,
} from 'shards-react';
import { NavLink } from 'react-router-dom';
import EthnicButtons from './EthnicButtons';
import UserActions from './UserActions';

import RegionSearch from './RegionSearch';
import SidebarMainNavbar from './SidebarMainNavbar';
import SidebarSearch from './SidebarSearch';
import SidebarNavItems from './SidebarNavItems';
import SidebarNavItem from './SidebarNavItem';

import { Store } from '../../../flux';
import DropdownInputGroups from '../../components-overview/DropdownInputGroups';

class LandlordSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuVisible: false,
      sidebarNavItems: Store.getSidebarItems(),
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    Store.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      ...this.state,
      menuVisible: Store.getMenuState(),
      sidebarNavItems: Store.getSidebarItems(),
    });
  }

  render() {
    const classes = classNames('main-sidebar', 'px-0', 'col-12', this.state.menuVisible && 'open');

    return (
      <Col tag="aside" className={classes} lg={{ size: 2 }} md={{ size: 3 }}>
        <SidebarMainNavbar hideLogoText={this.props.hideLogoText} />
        <SidebarSearch />
        <SidebarNavItems />
      </Col>
    );
  }
}

LandlordSidebar.propTypes = {
  /**
   * Whether to hide the logo text, or not.
   */
  hideLogoText: PropTypes.bool,
};

LandlordSidebar.defaultProps = {
  hideLogoText: false,
};

export default LandlordSidebar;
