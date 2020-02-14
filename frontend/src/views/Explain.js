/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLocation, loadMap } from '../redux/actions/space';

import { Container, Row, Col, Card, CardBody, Button } from 'shards-react';

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
                  id="main-logo"
                  className="auth-form__logo d-table mx-auto mb-10"
                  style={{ maxHeight: '20px' }}
                  src="https://d3v63q50apccnu.cloudfront.net/insemble_i.png"
                  alt="Insemble Logo"
                />

                {/* Title */}
                <h5 className="auth-form__title text-center mb-4">Help</h5>

                <div className="list-group">
                  <a
                    href="#"
                    className="list-group-item list-group-item-action flex-column align-items-start"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">How to use</h5>
                    </div>
                    <p className="mb-1">
                      Insemble provides location recommendations based on your search parameters.
                      Click on the map to find more information about location. Use the search bar
                      to: pan to specific neighborhoods, see presence of specific retailers or
                      retailer types in an area.{' '}
                    </p>
                    <small>(Example searches include: "Brentwood" or "Taco shop").</small>
                  </a>
                  <a
                    href="#"
                    className="list-group-item list-group-item-action flex-column align-items-start"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">How is the map generated?</h5>
                    </div>
                    <p className="mb-1">
                      Insemble generates location recommendations using key factors about retail
                      stores comparable to your searched location or categories. We use advanced
                      analytics to minimize canibalization and optimize for cotenancy potential. If
                      you have concerns, feedback, or want to chat with us, please fill out you
                      "Feedback" section linked below.
                    </p>
                    <small className="text-muted">
                      Please contact us if you have any questions.
                    </small>
                  </a>
                  <a
                    href="#"
                    className="list-group-item list-group-item-action flex-column align-items-start"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">Saving Results (Coming Soon)</h5>
                    </div>
                    <p className="mb-1">
                      Unfortunately, you cannot save map results at the moment, but will be able to
                      in the very near future.
                    </p>
                  </a>
                </div>

                <Col className="align-items-center justify-content-center mt-3">
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

const mapStateToProps = (_state) => ({});

export default withRouter(
  connect(mapStateToProps, {
    getLocation,
    loadMap,
  })(Explain)
);
