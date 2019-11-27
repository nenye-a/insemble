/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import { connect } from "react-redux";

import { withRouter } from "react-router";
import { Redirect } from "react-router-dom";

import PropTypes from "prop-types";
import { register } from '../redux/actions/auth'

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
import { Link } from "react-router-dom";

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.firstNameInput = React.createRef();
    this.lastNameInput = React.createRef();
    this.emailInput = React.createRef();
    this.passwordInput = React.createRef();
    this.password2Input = React.createRef();
    this.companyInput = React.createRef();
    this.isRetailer = React.createRef();
    this.isLandlord = React.createRef();
    this.isBroker = React.createRef();
  }

  static PropTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  }

  onSubmit = e => {
    e.preventDefault();
    console.log(this.passwordInput.current.value)
    if(this.passwordInput.current.value !== this.password2Input.current.value) {
      console.log("Passwords do not match")
    } else {
      console.log()
      this.props.register(
        this.firstNameInput.current.value,
        this.lastNameInput.current.value,
        this.emailInput.current.value,
        this.passwordInput.current.value,
        this.companyInput.current.value,
        this.isLandlord.current.checked,
        this.isRetailer.current.checked,
        this.isBroker.current.checked
      )
    }
  }

  // onChange = e => this.setState({
  //   [e.target.name]: e.target.value
  // });

  render() {
    
    if(this.props.isAuthenticated) {
      return <Redirect to="/Matches"/>;
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
                  src={require("../images/shards-dashboards-logo.svg")}
                  alt="Retailer Dashboards - Register Template"
                />

                {/* Title */}
                <h5 className="auth-form__title text-center mb-4">
                  Register
                </h5>

                {/* Form Fields */}
                <Form>
                  <FormGroup>
                    <label htmlFor="exampleInputFirstName1">First Name</label>
                    <FormInput
                      type="text"
                      id="exampleInputFirstName1"
                      placeholder="Enter first name"
                      autoComplete="off"
                      innerRef = {this.firstNameInput}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="exampleInputLastName1">Last Name</label>
                    <FormInput
                      type="text"
                      id="exampleInputLastName1"
                      placeholder="Enter last name"
                      autoComplete="off"
                      innerRef={this.lastNameInput}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="exampleInputCompany1">Company</label>
                    <FormInput
                      type="text"
                      id="exampleInputCompany1"
                      placeholder="Enter company"
                      autoComplete="off"
                      innerRef={this.companyInput}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <FormInput
                      type="email"
                      id="exampleInputEmail1"
                      placeholder="Enter email"
                      autoComplete="email"
                      innerRef={this.emailInput}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <FormInput
                      type="password"
                      id="exampleInputPassword1"
                      placeholder="Password"
                      autoComplete="new-password"
                      innerRef={this.passwordInput}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="exampleInputPassword2">Confirm Password</label>
                    <FormInput
                      type="password"
                      id="exampleInputPassword2"
                      placeholder="Repeat Password"
                      autoComplete="new-password"
                      innerRef={this.password2Input}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="exampleInputPassword2">Profession</label>
                    <FormCheckbox
                      innerRef = {this.isRetailer}
                    >Retailer</FormCheckbox>
                    <FormCheckbox
                      innerRef = {this.isLandlord}
                    >Landlord</FormCheckbox>
                    <FormCheckbox
                      innerRef = {this.isBroker}
                    >Broker</FormCheckbox>
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="exampleInputPassword2">Terms & Conditions</label>
                    <FormCheckbox>
                      I agree with the <a href="#">Terms & Conditions</a>.
                    </FormCheckbox>
                  </FormGroup>
                  <Button
                    pill
                    theme="accent"
                    className="d-table mx-auto"
                    type="submit"
                    onClick = {this.onSubmit}
                  >
                    Create Account
                  </Button>
                </Form>
              </CardBody>

              {/* Social Icons
              <CardFooter>
                <ul className="auth-form__social-icons d-table mx-auto">
                  <li>
                    <a href="#">
                      <i className="fab fa-facebook-f" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fab fa-twitter" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fab fa-github" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fab fa-google-plus-g" />
                    </a>
                  </li>
                </ul>
              </CardFooter> */}
            </Card>

            {/* Meta Details */}
            <div className="auth-form__meta d-flex mt-4">
              <Link to="/forgot-password">Forgot your password?</Link>
              <Link to="/login" className="ml-auto">
                Sign In?
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default withRouter(connect(mapStateToProps, { register })(Register));
