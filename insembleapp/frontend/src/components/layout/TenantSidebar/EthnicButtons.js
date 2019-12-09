import React from 'react';
import { Row, Col, Button } from 'shards-react';

const EthnicButtons = () => (
  <Row className="mt-2 mx-auto">
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
