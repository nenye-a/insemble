import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Row, Col, ButtonGroup, Button, Slider, Collapse, DropdownMenu, DropdownItem, DropdownToggle, Dropdown, NavItem } from "shards-react";
import { NavLink } from "react-router-dom";
import EthnicButtons from "./EthnicButtons";
import MatchActions from "./MatchActions";


import RegionSearch from "./RegionSearch";
import SidebarMainNavbar from "./SidebarMainNavbar";
import SidebarSearch from "./SidebarSearch";
import SidebarNavItems from "./SidebarNavItems";
import SidebarNavItem from "./SidebarNavItem";

import { Store } from "../../../flux";
import DropdownInputGroups from "../../components-overview/DropdownInputGroups";
import CurrentActions from "./CurrentActions";

class TenantSpacesSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuVisible: false,
      sidebarNavItems: Store.getSidebarItems()
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
      sidebarNavItems: Store.getSidebarItems()
    });
  }

  render() {
    const classes = classNames(
      "main-sidebar",
      "px-0",
      "col-12",
      this.state.menuVisible && "open"
    );

    return (
      <Col
        tag="aside"
        className={classes}
        lg={{ size: 2 }}
        md={{ size: 3 }}
      >
        <SidebarMainNavbar hideLogoText={this.props.hideLogoText} />
        <SidebarSearch />

        {/* Page Header :: Actions */}
        <Col sm="12" className="my-8 col d-flex align-items-center">
          <ButtonGroup size="sm" className="my-3 d-inline-flex mb-3 mb-sm-0 mx-auto">
            <Button theme="white" tag={NavLink} to="/insights">
              Insights
            </Button>
            <Button theme="white" tag={NavLink} to="/spaces">
              Spaces
            </Button>
          </ButtonGroup>
        </Col>
        
        <MatchActions />
        <CurrentActions />
      </Col>
    );
  }
}

TenantSpacesSidebar.propTypes = {
  /**
   * Whether to hide the logo text, or not.
   */
  hideLogoText: PropTypes.bool
};

TenantSpacesSidebar.defaultProps = {
  hideLogoText: false
};

export default TenantSpacesSidebar;
