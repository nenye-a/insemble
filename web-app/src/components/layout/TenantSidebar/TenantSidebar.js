import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Row, Col, ButtonGroup, Button, Slider, Collapse, DropdownMenu, DropdownItem, DropdownToggle, Dropdown, NavItem } from "shards-react";
import { NavLink } from "react-router-dom";
import EthnicButtons from "./EthnicButtons";
import UserActions from "./UserActions";


import RegionSearch from "./RegionSearch";
import SidebarMainNavbar from "./SidebarMainNavbar";
import SidebarSearch from "./SidebarSearch";
import SidebarNavItems from "./SidebarNavItems";
import SidebarNavItem from "./SidebarNavItem";

import { Store } from "../../../flux";
import DropdownInputGroups from "../../components-overview/DropdownInputGroups";

class TenantSidebar extends React.Component {
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
              Matches
            </Button>
          </ButtonGroup>
        </Col>
        <Slider
          theme="royal-blue"
          className="my-4 col mx-2"
          connect
          start={[10000, 80000]}
          range={{ min: 0, max: 300000 }}
        />
        <UserActions />
        <h6 className="main-sidebar__nav-title">{"Demographic"}</h6>
        <EthnicButtons />
        <h6 className="main-sidebar__nav-title">{"Region"}</h6>
        <Button setState={true} outline size="sm" theme="royal-blue" className="my-2 ml-3">
        Los Angeles
        </Button>
        <RegionSearch />
        <h6 className="main-sidebar__nav-title">{"Income"}</h6>
        <Slider
          theme="royal-blue"
          className="my-4 col mx-2"
          connect
          start={[10000, 80000]}
          range={{ min: 0, max: 300000 }}
        />
        <h6 className="main-sidebar__nav-title">{"Population"}</h6>
        <Slider
          theme="royal-blue"
          className="my-4 col mx-2"
          connect
          start={[5000, 10000]}
          range={{ min: 0, max: 15000 }}
        />
      </Col>
    );
  }
}

TenantSidebar.propTypes = {
  /**
   * Whether to hide the logo text, or not.
   */
  hideLogoText: PropTypes.bool
};

TenantSidebar.defaultProps = {
  hideLogoText: false
};

export default TenantSidebar;
