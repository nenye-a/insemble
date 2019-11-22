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
    const { title } = this.props;

    return (
      <Card small className="h-100">
        {/* Card Header */}
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
          <div className="block-handle" />
        </CardHeader>

        <CardBody className="pt-3">
          <Container>
            <Row>
              <Col sm="6">
                <h6>High Performance</h6>
                <div>Ritual Coffee is rated highly in locations comparable to yours.</div>
              </Col>
              
              <Col sm="6">
                <h6>Customer Relevance</h6>
                <div>Customers visit your location when grabbing a coffee</div>
              </Col>
            </Row>
          </Container>
          
        </CardBody>
      </Card>
    );
  }
}

AtAGlance.defaultProps = {
  title: "At A Glance",
};

export default AtAGlance;
