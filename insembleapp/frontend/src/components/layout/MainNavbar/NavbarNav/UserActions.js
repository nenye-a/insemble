import React from 'react';
import { Link, Redirect, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../../../redux/actions/auth';

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  Button,
  Container,
} from 'shards-react';

class UserActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };

  toggleUserActions() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  renderAuthenticated = () => {
    if (this.props.auth.isAuthenticated) {
      return (
        <Container className="my-auto mx-auto">
          {/* <Button
          pill       
          theme="accent"
          tag={NavLink} 
          to="/login"
        >
          Login
        </Button> */}
        </Container>
      );
    } else {
      return <Container className="my-auto mx-auto"></Container>;
    }
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    // const authLinks = ();

    return this.renderAuthenticated();
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default withRouter(
  connect(
    mapStateToProps,
    { logout }
  )(UserActions)
);
