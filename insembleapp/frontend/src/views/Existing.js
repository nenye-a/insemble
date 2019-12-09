/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import { withRouter } from "react-router";
import { Link, Redirect} from "react-router-dom";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getLocation, loadMap } from '../redux/actions/space'

import LoadingOverlay from 'react-loading-overlay';

import { withAlert } from "react-alert"

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

class Existing extends React.Component {
  constructor(props) {
    super(props);
    this.storeNameInput = React.createRef()
    this.addressInput = React.createRef()
    this.alert = this.props.alert
    this.initialState = true
    
  }

  static propTypes = {
    getLocation: PropTypes.func.isRequired,
    locationLoaded: PropTypes.bool,
    locationIsLoading: PropTypes.bool,
    locationErr: PropTypes.string
  }

  onSubmit = e => {

    // clear any exisitng temporary store names in the sate
    sessionStorage.removeItem("sessionStoreName");

    // retrieve location based on address. Refer to Redux folder for method
    e.preventDefault();
    this.initialState = false
    const address = this.addressInput.current.value;
    this.props.getLocation('api/location/address='+address+'&radius=1');
  }

  render() {
    
    if(this.props.locationErr) {
      this.alert.show(this.props.locationErr)
    }
    
    // render map once confirmed that location has ben loaded
    if(this.props.locationLoaded && !this.initialState) {
      
      // load map and set to next page
      this.props.loadMap(true);

      // store storename in session to be retrieved at any moment
      const storename = this.storeNameInput.current.value;
      sessionStorage.setItem("sessionStoreName", storename);

      // move to exisiting store page
      return <Redirect push to="/verify"/>;
    }

    return (
      <Container fluid className="main-content-container h-100 px-4">
        <Row noGutters className="h-100">
          <Col lg="3" md="5" className="auth-form mx-auto my-auto">  
            <LoadingOverlay
              active={this.props.locationIsLoading}
              spinner
              text='Loading...'
            >
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
                    Enter your existing retail store
                  </h5>

                  {/* Form Fields */}
                  <Form>
                    <FormGroup>
                      <label htmlFor="exampleInputStoreName1">Store Name</label>
                      <FormInput
                        type="text"
                        id="exampleInputStoreName1"
                        placeholder="Enter store name"
                        autoComplete="off"
                        innerRef = {this.storeNameInput}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="exampleInputAddress1">Address of top performing location</label>
                      <FormInput
                        type="text"
                        id="exampleInputAddress"
                        placeholder="Enter address"
                        autoComplete="off"
                        innerRef = {this.addressInput}
                      />
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
                      See Next Best Locations
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </LoadingOverlay>
          </Col>
        </Row>
      </Container>
    )
  };
}

const mapStateToProps = state => ({
  locationLoaded: state.space.locationLoaded,
  locationIsLoading: state.space.locationIsLoading,
  locationErr: state.space.locationErr
})

export default withAlert()(withRouter(connect(mapStateToProps, {
  getLocation,
  loadMap 
})(Existing)));
