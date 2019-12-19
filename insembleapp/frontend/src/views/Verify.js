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
import { MAP_IFRAME_URL } from '../utils/urls';

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
      <>
        {/* TODO: Change los angeles from static input  */}
        <Iframe
          url={MAP_IFRAME_URL + storename.split(' ').join('+') + '+' + address.split(' ').join('+')}
          width="100%"
          height={window.innerHeight}
          id="myId"
          display="initial"
          className="p-0 m-0"
        />
        <div className="card-container">
          <Card className="p-3 outline-card">
            <CardHeader className="p-0">
              <h4 className="text-sm-center">Is this your store?</h4>
            </CardHeader>
            <CardBody className="p-0 justify-content-end align-items-end">
              <Button pill theme="white" tag={Link} to="/existing">
                No
              </Button>
              <Button pill theme="accent" onClick={this.onSubmit} className="ml-2">
                Yes
              </Button>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  address: state.space.location.address,
});

export default connect(mapStateToProps)(Verify);
