import React from 'react';
import { Card, CardHeader, CardBody, Row, Col, Container } from 'shards-react';

class AtAGlance extends React.Component {
  render() {
    const retailer = this.props.match;

    return (
      <Card small className="h-100">
        {/* Card Header */}
        <CardHeader className="border-bottom">
          <h6 className="m-0">At A Glance</h6>
          <div className="block-handle" />
        </CardHeader>

        <CardBody className="pt-3">
          <Container>
            <Row>
              <Col sm="6">
                <h6>High Performance</h6>
                <div>
                  {retailer.name} is rated highly ({retailer.ratings}) in locations comparable to
                  yours.
                </div>
              </Col>

              <Col sm="6">
                <h6>Customer Relevance</h6>
                <div>Customers visit your location when [NEED TO BASE ON CATEGORY or JOURNEY]</div>
              </Col>
            </Row>
          </Container>
        </CardBody>
      </Card>
    );
  }
}

export default AtAGlance;
