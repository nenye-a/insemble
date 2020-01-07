import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container } from 'shards-react';

import { logout } from '../../../../redux/actions/auth';

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
