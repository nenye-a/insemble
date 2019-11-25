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

import AtAGlance from "../components/location-deep-dive/AtAGlance";
import YourSite from "../components/location-deep-dive/YourSite";
import Buildout from "../components/location-deep-dive/Buildout";
import About from "../components/location-deep-dive/About";
import PageTitle from "../components/common/PageTitle";
import MapComponent from "./MapContainerDeepDive"
import Iframe from 'react-iframe';
import ThisLocation from "../components/location-deep-dive/ThisLocation";
import { Redirect } from 'react-router-dom'


class LocationDeepDiveDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false, 
      location: this.props.location.match
      };
  }

  handleRadiusClick (radius) {
    
    fetch('api/location/lat='+this.state.location.lat.toString().split(".").join("")+'&lng='+this.state.location.lng.toString().split(".").join("")+'&radius='+radius)
        .then(res => res.json())
        .then(data => {
          this.setState({redirect: true, location: data})});
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      
      return <Redirect to = {{pathname: "/location-deep-dive-demo", match: this.state.location}} />
    }
  }

  render(){
    // console.log(this.marker)
    // console.log("printed props")
    const location = this.state.location
    console.log(location)
    //const address = "3250 West Olympic Boulevard, Los Angeles"
    // const location = {
    //   name: "PizzaRev",
    //   address:"5608 Van Nuys Boulevard, Van Nuys", 
    //   census: {
    //     asian: 7.8,
    //     black: 6.6,
    //     hispanic: 17.1, 
    //     indian: 0.4,
    //     multi: 4,
    //     white: 65.7,
    //   },
    //   pop: 4015,
    //   income: 62963,
    //   place_type: {
    //     PizzaPlace: 1,
    //     FastFoodRestaurant: 1,
    //   },
    //   price: 2, 
    //   age: 5.76999892717773,
    //   icon: "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
    //   photo: "https://lh3.googleusercontent.com/p/AF1QipOzGbDOUJRU2nPTCRsaNttsGXl1jTeByUO_uQpH=s1600-w500-h500",
    // }
    
    return (
      <Container fluid className="main-content-container px-4">
        {/* {this.renderRedirect()} */}
        {/* TODO: Change los angeles from static input  */}
        <Row>
          <MapComponent {...location}/>
        </Row>
        {/* <Iframe url={"https://www.google.com/maps/embed/v1/search?key=AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U&q="+location.address.split(" ").join("+")+"+Los+Angeles"}
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
          <Col lg="6" md="6" sm="6" className="mb-4">
            <YourSite match={location}/>
          </Col>

          {/* Site Comparison */}
          <Col lg="6" md="6" sm="6" className="mb-4">

            <ThisLocation match={location}/>
          </Col>
        </Row>

        </Container>
    );
  }
}

export default LocationDeepDiveDemo;
