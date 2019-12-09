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
import CurrentCheckboxes from './CurrentCheckboxes';

export default class CurrentActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };

    this.toggleCurrentActions = this.toggleCurrentActions.bind(this);
  }

  toggleCurrentActions() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    return (
      <NavItem tag={Dropdown} caret toggle={this.toggleCurrentActions}>
        <DropdownToggle caret tag={NavLink}>
          <h6 className="main-sidebar__nav-title">{'Current Spaces'}</h6>
        </DropdownToggle>
        <Collapse tag={DropdownMenu} right small open={this.state.visible}>
          <DropdownItem>
            <CurrentCheckboxes />
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }
}
