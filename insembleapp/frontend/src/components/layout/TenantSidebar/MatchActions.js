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
import MatchCheckboxes from './MatchCheckboxes';

export default class MatchActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };

    this.toggleMatchActions = this.toggleMatchActions.bind(this);
  }

  toggleMatchActions() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    return (
      <NavItem tag={Dropdown} caret toggle={this.toggleMatchActions}>
        <DropdownToggle caret tag={NavLink}>
          <h6 className="main-sidebar__nav-title">{'Matches'}</h6>
        </DropdownToggle>
        <Collapse tag={DropdownMenu} right small open={this.state.visible}>
          <DropdownItem>
            <MatchCheckboxes />
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }
}
