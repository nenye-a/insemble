import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Container,
  ButtonGroup,
  Button, 
  Badge
} from "shards-react";

class AtAGlance extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const retailer = this.props.match

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
                <h6>Customer Relevance</h6>
                <div>Daytime population, median household income</div>
              </Col>
              
              <Col sm="6">
                <h6>Space</h6>
                <div>Sqf, LOD Details, Asking rent</div>
              </Col>
            </Row>
          </Container>
          
        </CardBody>
      </Card>
    );
  }
}

export default AtAGlance;
