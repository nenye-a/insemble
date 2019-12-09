/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../redux/actions/auth';

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Form,
  FormGroup,
  FormInput,
  FormCheckbox,
  Button,
} from 'shards-react';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.emailInput = React.createRef();
    this.passwordInput = React.createRef();
  }

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.login(this.emailInput.current.value, this.passwordInput.current.value);
  };

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/Find" />;
    }

    return (
      <header className="masthead">
        <div className="container h-100">
          <div className="row h-100 align-items-center justify-content-center text-center">
            <div className="col-lg-10 align-self-end">
              <h1 className="text-uppercase text-white">Insemble.App</h1>
              <hr className="divider my-4"/>
            </div>
            <div className="col-lg-8 align-self-baseline">
              <p className="text-white-75 font-weight-light mb-5">Instant Store or Retaurant Location Recommendaitons</p>
              <Button
                    pill
                    theme="accent"
                    tag={Link}
                    to="/find"
                  >
                    See Insights
              </Button>
              {/* <div className="card bg-dark text-white">
                <img className="card-img" src="..." alt="Card image"/>
              </div> */}
            </div>
          </div>
        </div>
      </header>
    )
  };
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default withRouter(
  connect(
    mapStateToProps,
    { login }
  )(Landing)
);
