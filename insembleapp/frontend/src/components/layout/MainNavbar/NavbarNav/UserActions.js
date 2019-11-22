import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types"
import { logout } from "../../../../redux/actions/auth"

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";

class UserActions extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      visible: false
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
  }

  static PropTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
  }

  toggleUserActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    // const authLinks = ();

    return (
      <NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
        <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
          <img
            className="user-avatar rounded-circle mr-2"
            src={require("./../../../../images/avatars/0.jpg")}
            alt="User Avatar"
          />{" "}
          <span className="d-none d-md-inline-block">Sierra Brooks</span>
        </DropdownToggle>
        <Collapse tag={DropdownMenu} right small open={this.state.visible}>
          <DropdownItem tag={Link} to="user-profile">
            <i className="material-icons">&#xE7FD;</i> Profile
          </DropdownItem>
          {/* <DropdownItem tag={Link} to="/" className="text-danger" onClick={this.props.logout}> */}
          <DropdownItem onClick={this.props.logout} className="text-danger">
            <i className="material-icons text-danger">&#xE879;</i> Logout
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, {logout})(UserActions);
