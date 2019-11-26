/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getLocation, loadMap } from '../redux/actions/space'

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

class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.storeNameInput = React.createRef()
    this.addressInput = React.createRef()
    this.state= {
      redirect: false
    }
    
  }

  static PropTypes = {
    getLocation: PropTypes.func.isRequired,
  }

  onSubmit = e => {
    e.preventDefault();
    const storename = this.storeNameInput.current.value;
    const address = this.addressInput.current.value;

    this.props.getLocation('api/location/address='+address+'&radius=1');
    this.props.loadMap(true);

    this.setState({
      redirect: true
    })
    
  }

  // renderRedirect = () => {
  //   if (this.redirect) {
      
  //     return <Redirect to="/verify" storename={storename} address={address}/>;
  //   }
  // }

  render() {

    if (this.state.redirect) {
      const storename = this.storeNameInput.current.value;
      const address = this.addressInput.current.value;
      return <Redirect to= {{pathname: "/verify",  match:{storename: storename, address: address}}}/>;
    }

    return (
      <Container fluid className="main-content-container h-100 px-4">
        {/* {this.renderRedirect()} */}
        <Row>
          <Button
            pill
            theme="accent"
            className="d-table mx-auto"
            type="submit"
            tag={Link} 
            to="/login"
          >
            Sign In
          </Button>
        </Row>
        <Row noGutters className="h-100">
          <Col lg="3" md="5" className="auth-form mx-auto my-auto">
            <Card>
              <CardBody>
                {/* Logo */}
                <img
                  className="auth-form__logo d-table mx-auto mb-3"
                  src={require("../images/shards-dashboards-logo.svg")}
                  alt="Retailer Dashboards - Login Template"
                />

                {/* Title */}
                <h5 className="auth-form__title text-center mb-4">
                  What can we do better?
                </h5>

                {/* Form Fields */}
                <Form>
                  <FormGroup>
                    <label htmlFor="exampleInputStoreName1">General Feedback</label>
                    <FormInput
                      type="text"
                      id="exampleInputStoreName1"
                      placeholder="How's the product?"
                      autoComplete="off"
                      innerRef = {this.storeNameInput}
                    />
                    <label htmlFor="exampleInputAddress1">Questions</label>
                    <FormInput
                      type="text"
                      id="exampleInputAddress"
                      placeholder="What questions do you have?"
                      autoComplete="off"
                      innerRef = {this.addressInput}
                    />
                    <label htmlFor="exampleInputAddress1">Features</label>
                    <FormInput
                      type="text"
                      id="exampleInputAddress"
                      placeholder="What else would you like to see?"
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
                    Submit
                  </Button>
                </Form>
              </CardBody>

            </Card>

          </Col>
        </Row>
      </Container>
    )
  };
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, {
  getLocation,
  loadMap 
})(Feedback);
