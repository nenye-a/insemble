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

class Find extends React.Component {
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
    
    // if(this.props.isAuthenticated) {
    //   return <Redirect to="/Matches"/>;
    // }
    
    return (
      <Container fluid className="main-content-container h-100 px-4">
        <Row noGutters className="h-100">
          <Col lg="6" md="8" className="mx-auto my-auto">
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
                  Find the best location for your store
                </h5>

                <Col>
                  <Row>
                    <Col className="d-flex flex-column justify-content-center align-items-center">
                      <Button
                        pill
                        theme="accent"
                        tag={Link}
                        to="/describe-store"
                      >
                        Enter applicable venue categories
                  </Button>
                    </Col>
                    <Col className="d-flex flex-column justify-content-center align-items-center">
                      <Button
                        pill
                        theme="accent"
                        tag={Link}
                        to="/existing"
                      >
                        Enter existing store address
                  </Button>
                    </Col>
                  </Row>
                </Col>


               
                
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

export default withRouter(connect(mapStateToProps, { login })(Find));
