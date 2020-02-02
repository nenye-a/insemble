import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Nav, Collapse } from 'shards-react';

import { Store } from '../../../flux';
import MenuItem from './MenuItem';

function HeaderNavbar(props) {
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
  const { items } = props;
  return (
    <Collapse className="header-navbar d-lg-flex p-0 bg-white border-top" open={menuVisible}>
      <Container>
        <Row>
          <Col>
            <Nav tabs className="border-0 flex-column flex-lg-row">
              {items.map((item, idx) => (
                <MenuItem key={idx} item={item} />
              ))}
            </Nav>
          </Col>
        </Row>
      </Container>
    </Collapse>
  );
}

HeaderNavbar.propTypes = {
  /**
   * The array of header navbar items.
   */
  items: PropTypes.array,
};

export default HeaderNavbar;
