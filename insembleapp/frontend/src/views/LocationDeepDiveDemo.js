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
  Button
} from "shards-react";

import AtAGlance from "../components/location-deep-dive/AtAGlance";
import YourSite from "../components/location-deep-dive/YourSite";
import Buildout from "../components/location-deep-dive/Buildout";
import About from "../components/location-deep-dive/About";
import PageTitle from "../components/common/PageTitle";
import MapContainer from "./MapContainer";
import Iframe from 'react-iframe';
import ThisLocation from "../components/location-deep-dive/ThisLocation";

class LocationDeepDiveDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageList: ["whatever"]
      };
  }

  render(){
    console.log("here we go")
    console.log(this.props.location.match)
    // console.log(this.marker)
    // console.log("printed props")
    const location = this.props.location.match
    const address = "3250 West Olympic Boulevard, Los Angeles"
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
        {/* TODO: Change los angeles from static input  */}
        <Iframe url={"https://www.google.com/maps/embed/v1/search?key=AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U&q="+address.split(" ").join("+")+"+Los+Angeles"}
        width="100%"
        height="300px"
        id="myId"
        className="mx-auto"
        display="initial"
        position="relative"/>

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
          
          <PageTitle title={address} subtitle="Stats for" className="ml-3 mt-0" />
        </Row>

        <Row noGutters className="page-header py-2">
          <PageTitle sm="4" title="Site Comparison" className="text-sm-left" />
        </Row>

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
