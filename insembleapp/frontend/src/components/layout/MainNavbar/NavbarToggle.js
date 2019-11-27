import React from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Button } from "shards-react";
import { withRouter } from "react-router"
import { NavLink } from "react-router-dom";

import { Dispatcher, Constants } from "../../../flux";

class NavbarToggle extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  static PropTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  }

  handleClick() {
    Dispatcher.dispatch({
      actionType: Constants.TOGGLE_SIDEBAR
    });
  }

  renderAuthenticated = () => {
    if (this.props.isAuthenticated) {
      
      return <nav className="nav">
        auth
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" onClick={this.handleClick} className="nav-link nav-link-icon toggle-sidebar d-sm-inline d-md-inline d-lg-none text-center">
          <i className="material-icons">&#xE5D2;</i>
        </a>
      </nav>
    }
    else{
      return <Button
      pill
      theme="accent"
      className="d-table mx-auto"
      tag={NavLink}
      to="/login"
    >
      Login
    </Button>

    }
  }

  render() {
    return this.renderAuthenticated()
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default withRouter(connect(mapStateToProps)(NavbarToggle));