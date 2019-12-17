import React from 'react';
import { Container, Row, Col, ButtonGroup, Button } from 'shards-react';

import MapComponent from './MapContainer';

import LoadingOverlay from 'react-loading-overlay';

import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Spaces extends React.PureComponent {
  static propTypes = {
    mapIsLoading: PropTypes.bool.isRequired,
  };

  state = { markers: [], heats: [] };

  render() {
    let { markers, heats } = this.state;
    return (
      <LoadingOverlay
        active={this.props.mapIsLoading}
        spinner
        text="Evaluating thousands of locations to find your matches. May take a couple minutes..."
      >
        <Container fluid className="main-content-container m-0">
          <Row>
            <MapComponent markers={markers} heats={heats} />
          </Row>
        </Container>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => ({
  mapIsLoading: state.space.mapIsLoading,
});

export default withRouter(connect(mapStateToProps)(Spaces));
