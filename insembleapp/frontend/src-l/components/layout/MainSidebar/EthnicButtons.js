import React from "react";
import { Row, Col, Button } from "shards-react";

const EthnicButtons = () => (
  <Row className="mb-3 mt-2">
    <Col>
      <Button outline size="sm" theme="royal-blue" className="mb-2 mr-1">
        Asian
      </Button>
      <Button outline size="sm" theme="royal-blue" className="mb-2 mr-1">
        Black
      </Button>
      <Button outline size="sm" theme="royal-blue" className="mb-2 mr-1">
        Hispanic
      </Button>
      <Button outline size="sm" theme="royal-blue" className="mb-2 mr-1">
        Indian
      </Button>
      <Button outline size="sm" theme="royal-blue" className="mb-2 mr-1">
        Multi
      </Button>
      <Button outline size="sm" theme="royal-blue" className="mb-2 mr-1">
        White
      </Button>
    </Col>
  </Row>
);

export default EthnicButtons;
