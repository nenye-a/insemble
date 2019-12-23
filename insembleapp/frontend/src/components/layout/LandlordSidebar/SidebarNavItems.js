import React, { useState, useEffect } from 'react';
import { Nav } from 'shards-react';

import SidebarNavItem from './SidebarNavItem';
import { Store } from '../../../flux';

function SidebarNavItems() {
  let [navItems, setNavItems] = useState([]);

  useEffect(() => {
    let onChange = () => {
      setNavItems(Store.getSidebarItems());
    };
    Store.addChangeListener(onChange);
    return () => {
      Store.removeChangeListener(onChange);
    };
  }, []);

  return (
    <div className="nav-wrapper">
      {navItems.map((nav, idx) => (
        <div key={idx}>
          <h6 className="main-sidebar__nav-title">{nav.title}</h6>
          {typeof nav.items !== 'undefined' && nav.items.length && (
            <Nav className="nav--no-borders flex-column">
              {nav.items.map((item, idx) => (
                <SidebarNavItem key={idx} item={item} />
              ))}
            </Nav>
          )}
        </div>
      ))}
    </div>
  );
}

export default SidebarNavItems;
