/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
} from 'shards-react';

import AtAGlance from '../components/location-deep-dive/AtAGlance';
import YourSite from '../components/location-deep-dive/YourSite';
import Buildout from '../components/location-deep-dive/Buildout';
import About from '../components/location-deep-dive/About';
import PageTitle from '../components/common/PageTitle';
import MapContainer from './MapContainer';
import Iframe from 'react-iframe';
import ThisLocation from '../components/location-deep-dive/ThisLocation';

class Verify extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageList: ['whatever'],
      redirect: false,
    };
  }

  static propTypes = {
    address: PropTypes.string.isRequired,
  };
  onSubmit = (e) => {
    e.preventDefault();
    this.setState({
      redirect: true,
    });
  };

  render() {
    const storename = sessionStorage.getItem('sessionStoreName');
    const address = this.props.address;

    if (this.state.redirect) {
      return <Redirect push to={{ pathname: '/spaces', match: { storename, address } }} />;
    }

    return (
      <Container fluid>
        {/* TODO: Change los angeles from static input  */}
        <Iframe
          url={
            'https://www.google.com/maps/embed/v1/search?key=DELETED_GOOGLE_API_KEY&q=' +
            storename.split(' ').join('+') +
            '+' +
            address.split(' ').join('+')
          }
          width="100%"
          height="600px"
          id="myId"
          className="mx-auto"
          display="initial"
        />

        <Row noGutters className="page-header py-2">
          <PageTitle sm="4" title="Is this your store?" className="text-sm-center" />
        </Row>
        <Row className="align-items-center justify-content-center">
          <Col md="4">
            <Button pill theme="white" tag={Link} to="/existing" className="mx-2">
              No
            </Button>
            <Button pill theme="accent" onClick={this.onSubmit} className="mx-2">
              Yes
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  address: state.space.location.address,
});

export default connect(mapStateToProps)(Verify);
