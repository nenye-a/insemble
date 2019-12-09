import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink,
} from 'shards-react';
import Checkboxes from './Checkboxes';

export default class UserActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
  }

  toggleUserActions() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    return (
      <NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
        <DropdownToggle caret tag={NavLink}>
          <h6 className="main-sidebar__nav-title">{'Category'}</h6>
        </DropdownToggle>
        <Collapse tag={DropdownMenu} right small open={this.state.visible}>
          <DropdownItem>
            <Checkboxes />
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }
}
