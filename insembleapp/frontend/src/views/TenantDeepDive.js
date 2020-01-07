/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'shards-react';

import AtAGlance from '../components/tenant-deep-dive/AtAGlance';
import YourSite from '../components/tenant-deep-dive/YourSite';
import Buildout from '../components/tenant-deep-dive/Buildout';
import About from '../components/tenant-deep-dive/About';
import PageTitle from '../components/common/PageTitle';
import Iframe from 'react-iframe';
import RetailerSite from '../components/tenant-deep-dive/RetailerSite';

class TenantDeepDive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageList: ['whatever'],
    };
  }

  render() {
    //console.log(this.props.location.match)
    const retailer = this.props.location.match;
    // const {
    //   pageList
    // } = this.state;

    return (
      <Container fluid className="main-content-container px-4">
        {/* TODO: Change los angeles from static input  */}
        <Iframe
          url={
            'https://www.google.com/maps/embed/v1/search?key=AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U&q=' +
            retailer.name.split(' ').join('+') +
            '+Los+Angeles'
          }
          width="100%"
          height="300px"
          id="myId"
          className="mx-auto"
          display="initial"
          position="relative"
        />

        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <div className="user-details__avatar" position="absolute" top="30">
            <img src={retailer.icon} alt={'Coffe Shop'} />
          </div>
          <PageTitle
            title={retailer.name}
            subtitle={Object.keys(retailer.place_type)[0]}
            className="ml-4 mt-3"
          />
        </Row>

        {/* Second Row of Posts */}
        <Row>
          {/* At A Glance */}
          <Col lg="7" md="12" sm="12" className="mb-4">
            <AtAGlance match={retailer} />
          </Col>

          {/* About */}
          <Col lg="5" md="6" sm="6" className="mb-4">
            <About match={retailer} />
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
            <RetailerSite match={retailer} />
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

export default TenantDeepDive;
