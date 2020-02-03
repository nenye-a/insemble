import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col } from 'shards-react';

import SidebarMainNavbar from './SidebarMainNavbar';
import SidebarSearch from './SidebarSearch';
import SidebarNavItems from './SidebarNavItems';

import { Store } from '../../../flux';

function LandlordSidebar(props) {
  let [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    let onChange = () => {
      setMenuVisible(Store.getMenuState());
    };
    Store.addChangeListener(onChange);
    return () => {
      Store.removeChangeListener(onChange);
    };
  }, []);

  const classes = classNames('main-sidebar', 'px-0', 'col-12', menuVisible && 'open');

  return (
    <Col tag="aside" className={classes} lg={{ size: 2 }} md={{ size: 3 }}>
      <SidebarMainNavbar hideLogoText={props.hideLogoText} />
      <SidebarSearch />
      <SidebarNavItems />
    </Col>
  );
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
