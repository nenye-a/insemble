/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
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

class Landing extends React.Component {
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
      return <Redirect to="/Matches"/>;
    }
    
    return (
      <Container fluid className="main-content-container h-100 px-4">
        <Row noGutters className="h-100">
          <Col lg="8" md="8" className="auth-form mx-auto my-auto">
            <Card>
              <CardBody>
                {/* Logo */}
                <img
                  className="auth-form__logo d-table mx-auto mb-3"
                  src={require("../images/shards-dashboards-logo.svg")}
                  alt="Retailer Dashboards - Login Template"
                />

                {/* Title */}
                <h5 className="auth-form__title text-center mb-4">
                  RetailSpace.ai
                </h5>

                {/* Form Fields */}
                <Form>
                <Button
                    pill
                    theme="accent"
                    className="d-table mx-auto"
                    type="submit"
                    tag={Link} 
                    to="/find"
                  >
                    See Insights
                  </Button>
                  <Button
                    pill
                    theme="accent"
                    className="d-table mx-auto"
                    type="submit"
                    tag={Link} 
                    to="/login"
                  >
                    Sign In
                  </Button>
                </Form>
              </CardBody>

            </Card>
          </Col>
        </Row>
      </Container>
    )
  };
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Landing);
