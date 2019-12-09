import React from 'react';
import { Col, FormCheckbox } from 'shards-react';

const MatchCheckboxes = () => (
  <Col sm="12" md="4" className="mb-3">
    <fieldset>
      <FormCheckbox>2241 Rosecrans Avenue</FormCheckbox>
      <FormCheckbox>4433 Alameda Street</FormCheckbox>
      <FormCheckbox>2086 Pacific Avenue</FormCheckbox>
      <FormCheckbox>5535 Long Beach Boulevard</FormCheckbox>
    </fieldset>
  </Col>
);

export default MatchCheckboxes;
