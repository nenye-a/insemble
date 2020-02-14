import React from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLocation, loadMap } from '../redux/actions/space';

import LoadingOverlay from 'react-loading-overlay';

import { withAlert } from 'react-alert';

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  FormInput,
  Button,
} from 'shards-react';

class Existing extends React.Component {
  constructor(props) {
    super(props);
    this.storeNameInput = React.createRef();
    this.addressInput = React.createRef();
    this.alert = this.props.alert;
    this.initialState = true;
  }

  componentDidMount() {
    // Show previous search from the session
    if (sessionStorage.getItem('sessionStoreName')) {
      this.storeNameInput.current.value = sessionStorage.getItem('sessionStoreName');
    }
    if (sessionStorage.getItem('sessionAddress')) {
      this.addressInput.current.value = sessionStorage.getItem('sessionAddress');
    }
  }

  static propTypes = {
    getLocation: PropTypes.func.isRequired,
    locationLoaded: PropTypes.bool,
    locationIsLoading: PropTypes.bool,
    locationErr: PropTypes.string,
  };

  onSubmit = (e) => {
    // clear any exisitng temporary store names, tags, or income notices in the session
    sessionStorage.removeItem('sessionStoreName');
    sessionStorage.removeItem('sessionAddress');
    sessionStorage.removeItem('sessionIncome');
    sessionStorage.removeItem('sessionTags');

    // retrieve location based on address. Refer to Redux folder for method
    e.preventDefault();
    this.initialState = false;
    const address = this.addressInput.current.value;
    sessionStorage.setItem('sessionAddress', address);
    this.props.getLocation('api/location/address=' + address + '&radius=1');
  };

  render() {
    if (this.props.locationErr) {
      this.alert.show(this.props.locationErr);
    }

    // render map once confirmed that location has ben loaded
    if (this.props.locationLoaded && !this.initialState) {
      // load map and set to next page
      this.props.loadMap(true);

      // store storename in session to be retrieved at any moment
      const storename = this.storeNameInput.current.value;
      sessionStorage.setItem('sessionStoreName', storename);

      // move to exisiting store page
      return <Redirect push to="/verify" />;
    }

    return (
      <Container fluid className="main-content-container h-100 px-4">
        <Row noGutters className="h-100">
          <Col lg="3" md="5" className="auth-form mx-auto my-auto">
            <LoadingOverlay active={this.props.locationIsLoading} spinner text="Loading...">
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
                  <h5 className="auth-form__title text-center">Enter your existing retail store</h5>
                  <p className="mb-4 text-center">
                    <small>
                      Receive location recommendations based on the qualities of your existing space
                    </small>
                  </p>

                  {/* Form Fields */}
                  <Form>
                    <FormGroup>
                      <label htmlFor="exampleInputStoreName1">Store Name</label>
                      <FormInput
                        type="text"
                        id="exampleInputStoreName1"
                        placeholder="Enter store name"
                        autoComplete="off"
                        innerRef={this.storeNameInput}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="exampleInputAddress1">
                        Address of top performing location
                      </label>
                      <FormInput
                        type="text"
                        id="exampleInputAddress"
                        placeholder="Enter address"
                        autoComplete="off"
                        innerRef={this.addressInput}
                      />
                    </FormGroup>
                    <Button
                      pill
                      theme="accent"
                      className="d-table mx-auto"
                      type="submit"
                      // tag={NavLink} - removed
                      // to="/spaces"
                      onClick={this.onSubmit}
                    >
                      See Next Best Locations
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </LoadingOverlay>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  locationLoaded: state.space.locationLoaded,
  locationIsLoading: state.space.locationIsLoading,
  locationErr: state.space.locationErr,
});

export default withAlert()(
  withRouter(
    connect(mapStateToProps, {
      getLocation,
      loadMap,
    })(Existing)
  )
);
