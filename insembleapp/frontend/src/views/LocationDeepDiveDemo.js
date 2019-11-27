/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Button, 
  ButtonGroup
} from "shards-react";

import YourSite from "../components/location-deep-dive/YourSite";
import PageTitle from "../components/common/PageTitle";
import MapComponent from "./MapContainerDeepDive"
import ThisLocation from "../components/location-deep-dive/ThisLocation";
import { Redirect } from 'react-router-dom'

import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { getLocation } from '../redux/actions/space'

class LocationDeepDiveDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false, 
      location: this.props.location.match, 
      };
  }

  static PropTypes = {
    hasLocation: PropTypes.bool.isRequired,
    yourLocation: PropTypes.object,
    getLocation: PropTypes.func.isRequired
  }

  handleRadiusClick (radius) {
    
    if(this.props.hasLocation){
      console.log("Your_Location", this.props.yourLocation)
      const yourSiteURL = 'api/location/address='+this.props.yourLocation.address+'&radius='+radius;
      this.props.getLocation(yourSiteURL);
    }
    fetch('api/location/lat='+this.state.location.lat.toString().split(".").join("")+'&lng='+this.state.location.lng.toString().split(".").join("")+'&radius='+radius)
        .then(res => res.json())
        .then(data => {
          sessionStorage.setItem("temp_location", JSON.stringify(data))
          this.setState({redirect: true, location: data})});
  }

  renderYourSite = () => {
    if (this.props.hasLocation && this.props.yourLocation) {
      return <Col lg="6" md="6" sm="6" className="mb-4"><YourSite match={this.props.yourLocation}/></Col>
    }
  }

  render(){
    var location = this.state.location
    if(!location) {
      // check if the temp location in currently stored in local storage
      location = JSON.parse(sessionStorage.getItem("temp_location"))
    }
    
    return (
      <Container fluid className="main-content-container px-4">
        {/* TODO: Change los angeles from static input  */}
        <Row>
          <MapComponent {...location}/>
        </Row>
        {/* <Iframe url={"https://www.google.com/maps/embed/v1/search?key=DELETED_GOOGLE_API_KEY&q="+location.address.split(" ").join("+")+"+Los+Angeles"}
        width="100%"
        height="300px"
        id="myId"
        className="mx-auto"
        display="initial"
        position="relative"/> */}

        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <div position="relative" top="30">
            <img
              className="d-inline-block mx-auto"
              style={{ maxHeight: "50px" }}
              src={require("../images/insemble_i.png")}
              alt="Owner Dashboard"
            />
          </div>
          
          <PageTitle title={location.address} subtitle="Stats for" className="ml-3 mt-0" />
        </Row>

        <Row noGutters className="page-header py-2">
          <PageTitle sm="4" title="Site Comparison" className="text-sm-left" />
        </Row>
        <Col lg="4" md="4" className="align-items-center justify-content-center py-1">
          <Row>
            <Col>Radius: 
            </Col>
            <Col>
              <ButtonGroup size="sm" className="my-auto d-inline-flex mb-sm-auto mx-auto">
                <Button theme="white" onClick={()=>this.handleRadiusClick(1)}>
                  1
                </Button>
                <Button theme="white" onClick={()=>this.handleRadiusClick(3)}>
                  3
                </Button>
                <Button theme="white" onClick={()=>this.handleRadiusClick(5)}>
                  5
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Col>

        {/* Site Comparison */}
        <Row>
          {/* Site Comparison */}
          {this.renderYourSite()}

          {/* Site Comparison */}
          <Col lg="6" md="6" sm="6" className="mb-4">

            <ThisLocation match={location}/>
          </Col>
        </Row>

        </Container>
    );
  }
}

const mapStateToProps = state => ({
  hasLocation: state.space.hasLocation,
  yourLocation: state.space.location,
})

export default connect(mapStateToProps, {
  getLocation
})(LocationDeepDiveDemo);
