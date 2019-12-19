/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from 'react';

import { withRouter } from 'react-router';
import { Link, Redirect } from 'react-router-dom';

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

class Find extends React.Component {
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
                  style={{ maxHeight: '25px' }}
                  src="https://insemble-photos.s3.us-east-2.amazonaws.com/insemble_i.png"
                  alt="Retailer Dashboards - Login Template"
                />

                {/* Title */}
                <h5 className="auth-form__title text-center">
                  Find the best location for your store
                </h5>
                <p className="mb-4 text-center">
                  <small>
                    See location recommendations based on an existing location in LA, or your target
                    income and store categories.
                  </small>
                </p>
                <Row>
                  <Col sm="6" xs="12" className="d-flex align-items-stretch mb-1">
                    <Button
                      pill
                      theme="accent"
                      tag={Link}
                      to="/describe-store"
                      className="d-flex align-items-center justify-content-center btn-block"
                    >
                      Enter applicable venue categories
                    </Button>
                  </Col>
                  <Col sm="6" xs="12" className="d-flex align-items-stretch mb-1">
                    <Button
                      pill
                      theme="accent"
                      tag={Link}
                      to="/existing"
                      className="d-flex align-items-center justify-content-center btn-block"
                    >
                      Enter existing store address
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default withRouter(
  connect(
    mapStateToProps,
    { login }
  )(Find)
);
