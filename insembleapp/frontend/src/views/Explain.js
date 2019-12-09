/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from 'react';
import { Link, Redirect, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLocation, loadMap } from '../redux/actions/space';

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

class Explain extends React.Component {
  constructor(props) {
    super(props);
    this.storeNameInput = React.createRef();
    this.addressInput = React.createRef();
    this.state = {
      redirect: false,
    };
  }

  static propTypes = {
    getLocation: PropTypes.func.isRequired,
  };

  onSubmit = (e) => {
    e.preventDefault();
    const storename = this.storeNameInput.current.value;
    const address = this.addressInput.current.value;

    this.props.getLocation('api/location/address=' + address + '&radius=1');
    this.props.loadMap(true);

    this.setState({
      redirect: true,
    });
  };

  // renderRedirect = () => {
  //   if (this.redirect) {

  //     return <Redirect to="/verify" storename={storename} address={address}/>;
  //   }
  // }

  render() {
    if (this.state.redirect) {
      const storename = this.storeNameInput.current.value;
      const address = this.addressInput.current.value;
      return (
        <Redirect to={{ pathname: '/verify', match: { storename: storename, address: address } }} />
      );
    }

    return (
      <Container fluid className="main-content-container h-100 px-4">
        {/* {this.renderRedirect()} */}
        <Row noGutters className="h-100">
          <Col lg="7" md="8" className="mx-auto my-auto">
            <Card>
              <CardBody>
                {/* Logo */}
                <img
                  className="auth-form__logo d-table mx-auto mb-3"
                  src={require('../images/shards-dashboards-logo.svg')}
                  alt="Retailer Dashboards - Login Template"
                />

                {/* Title */}
                <h5 className="auth-form__title text-center mb-4">What am I looking at?</h5>

                <Col className="d-flex flex-column justify-content-center">
                  <Row className="py-1" style={{ fontWeight: 'bold' }}>
                    Map
                  </Row>
                  <Row className="py-1">this is some text about the heat map</Row>
                  <Row className="py-1" style={{ fontWeight: 'bold' }}>
                    Data
                  </Row>
                  <Row className="py-1">this is some text about how it's generated</Row>
                  <Row className="py-1" style={{ fontWeight: 'bold' }}>
                    Saving Results
                  </Row>
                  <Row className="py-1">this is some text about how to interact</Row>
                </Col>

                <Col className="align-items-center justify-content-center">
                  <Button theme="accent" tag={NavLink} to="/spaces">
                    Return to Map
                  </Button>
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({});

export default withRouter(
  connect(
    mapStateToProps,
    {
      getLocation,
      loadMap,
    }
  )(Explain)
);
