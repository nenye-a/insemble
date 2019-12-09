import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Container,
  ButtonGroup,
  Button,
  Badge,
} from 'shards-react';

class Buildout extends React.Component {
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
                <h6>Space Requirements</h6>
                <div>2500 Square feet, 12' ceilings, ADA Compliant Bathrooms...</div>
              </Col>

              <Col sm="6">
                <h6>Equipment</h6>
                <div>Fume hood, Grease Trap, Industrial Freezer...</div>
              </Col>
            </Row>
          </Container>
        </CardBody>
      </Card>
    );
  }
}

Buildout.defaultProps = {
  title: 'Physical Requirements',
};

export default Buildout;
