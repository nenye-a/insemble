/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import { Link, Redirect } from "react-router-dom";

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

class Verify extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageList: ["whatever"],
      redirect: false
    };
  }

  onSubmit = e => {
    e.preventDefault();
    this.setState({
      redirect: true
    })

  }

  render() {
    const location = this.props.location.match
    if (this.state.redirect) {
      return <Redirect to={{ pathname: "/spaces", match: { storename: location.storename, address: location.address } }} />;
    }

    console.log("here we go")
    console.log(this.props)
    // console.log(this.marker)
    // console.log("printed props")

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
      <Container fluid>
        {/* TODO: Change los angeles from static input  */}
        <Iframe url={"https://www.google.com/maps/embed/v1/search?key=AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U&q=" + location.storename.split(" ").join("+") + "+" + location.address.split(" ").join("+")}
          width="100%"
          height="600px"
          id="myId"
          className="mx-auto"
          display="initial" />


        <Row noGutters className="page-header py-2">
          <PageTitle sm="4" title="Is this your store?" className="text-sm-center" />
        </Row>
        <Row className="align-items-center justify-content-center">
          <Col md="4">
              <Button
                pill
                theme="white"
                tag={Link}
                to="/existing"
                className="mx-2"
              >
                No
            </Button>
              <Button
                pill
                theme="accent"
                onClick={this.onSubmit}
                className="mx-2"
              >
                Yes
          </Button>
          </Col>


        </Row>

      </Container>
    );
  }
}

export default Verify;
