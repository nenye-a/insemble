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

class LocationDeepDive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageList: ["whatever"]
      };
  }

  render(){
    console.log("here we go")
    console.log(this.props)
    // console.log(this.marker)
    // console.log("printed props")
    // const location = this.props.location.match
    const location = {
      name: "PizzaRev",
      address:"5608 Van Nuys Boulevard, Van Nuys", 
      census: {
        asian: 7.8,
        black: 6.6,
        hispanic: 17.1, 
        indian: 0.4,
        multi: 4,
        white: 65.7,
      },
      pop: 4015,
      income: 62963,
      place_type: {
        PizzaPlace: 1,
        FastFoodRestaurant: 1,
      },
      price: 2, 
      age: 5.76999892717773,
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
      photo: "https://lh3.googleusercontent.com/p/AF1QipOzGbDOUJRU2nPTCRsaNttsGXl1jTeByUO_uQpH=s1600-w500-h500",
    }
    
    return (
      <Container fluid className="main-content-container px-4">
        {/* TODO: Change los angeles from static input  */}
        <Iframe url={"https://www.google.com/maps/embed/v1/search?key=AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U&q="+location.address.split(" ").join("+")+"+Los+Angeles"}
        width="100%"
        height="300px"
        id="myId"
        className="mx-auto"
        display="initial"
        position="relative"/>

        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <div className="user-details__avatar" position="absolute" top="30">
            <img src={location.icon} alt={"Coffe Shop"} />
          </div>
          <PageTitle title={location.name} subtitle={Object.keys(location.place_type)[0]} className="ml-4 mt-3" />
        </Row>

        {/* Second Row of Posts */}
        <Row>
          {/* At A Glance */}
          <Col lg="7" md="12" sm="12" className="mb-4">
            <AtAGlance match={location} />
          </Col>

          {/* About */}
          <Col lg="5" md="6" sm="6" className="mb-4">
            <About match={location}/>
          </Col>
        </Row>

        <Row noGutters className="page-header py-2">
          <PageTitle sm="4" title="Site Comparison" className="text-sm-left" />
        </Row>

        {/* Site Comparison */}
        <Row>
          {/* Site Comparison */}
          <Col lg="6" md="6" sm="6" className="mb-4">
            <YourSite />
          </Col>

          {/* Site Comparison */}
          <Col lg="6" md="6" sm="6" className="mb-4">
            <ThisLocation match={location}/>
          </Col>
        </Row>

        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Buildout" className="text-sm-left" />
        </Row>

        {/* Buildout */}
        <Row>
          {/* Site Comparison */}
          <Col className="mb-4">
            <Buildout />
          </Col>
        </Row>

        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Customer Journey" className="text-sm-left" />
        </Row>

        {/* Fourth Row of posts */}
        {/* Default Light Table */}
        <Row>
          <Col>
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">Before</h6>
              </CardHeader>
              <CardBody className="p-0 pb-3">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                        Rank
                      </th>
                      <th scope="col" className="border-0">
                        Coming From
                      </th>
                      <th scope="col" className="border-0">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Home</td>
                      <td>45</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Work</td>
                      <td>25</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Sandwich Shop</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Park</td>
                      <td>10</td>
                    </tr>
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card small className="mb-4 overflow-hidden">
              <CardHeader className="bg-dark">
                <h6 className="m-0 text-white">After</h6>
              </CardHeader>
              <CardBody className="bg-dark p-0 pb-3">
                <table className="table table-dark mb-0">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col" className="border-0">
                        Rank
                      </th>
                      <th scope="col" className="border-0">
                        Going To
                      </th>
                      <th scope="col" className="border-0">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Home</td>
                      <td>45</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Work</td>
                      <td>25</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Sandwich Shop</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Park</td>
                      <td>10</td>
                    </tr>
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        
        </Row>

      </Container>
    );
  }
}

export default LocationDeepDive;
