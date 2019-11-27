/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";

import { withRouter } from "react-router";
import { Link, Redirect } from "react-router-dom";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from '../redux/actions/auth'

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
  Button
} from "shards-react";

import {NavLink} from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.emailInput = React.createRef()
    this.passwordInput = React.createRef()
  }

  static PropTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.login(
      this.emailInput.current.value,
      this.passwordInput.current.value
    )
  }

  render() {
    
    if(this.props.isAuthenticated) {
      return <Redirect to="/Find"/>;
    }
    
    return (
      <Container fluid className="main-content-container h-100 px-4">
        <Row noGutters className="h-100">
          <Col lg="3" md="5" className="auth-form mx-auto my-auto">
            <Card>
              <CardBody>
                {/* Logo */}
                <img
                  className="auth-form__logo d-table mx-auto mb-3"
                  style={{ maxHeight: "25px" }}
                  src={require("../images/insemble_i.png")}
                  alt="Retailer Dashboards - Login Template"
                />

                {/* Title */}
                <h5 className="auth-form__title text-center mb-4">
                  Login
                </h5>

                {/* Form Fields */}
                <Form>
                  <FormGroup>
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <FormInput
                      type="email"
                      id="exampleInputEmail1"
                      placeholder="Enter email"
                      autoComplete="email"
                      innerRef = {this.emailInput}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <FormInput
                      type="password"
                      id="exampleInputPassword1"
                      placeholder="Password"
                      autoComplete="current-password"
                      innerRef= {this.passwordInput}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormCheckbox>Remember me for 30 days.</FormCheckbox>
                  </FormGroup>
                  <Button
                    pill
                    theme="accent"
                    className="d-table mx-auto"
                    type="submit"
                    // tag={NavLink} - removed
                    // to="/spaces"
                    onClick = {this.onSubmit}
                  >
                    Login
                  </Button>
                </Form>
              </CardBody>
            </Card>

            {/* Meta Details */}
            <div className="auth-form__meta d-flex mt-4">
              <Link to="/forgot-password">Forgot your password?</Link>
              <Link to="/register" className="ml-auto">
                Create a new account?
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    )
  };
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default withRouter(connect(mapStateToProps, { login })(Login));
