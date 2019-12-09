import React from 'react';
import { Col, FormCheckbox } from 'shards-react';

const MatchCheckboxes = () => (
  <Col sm="12" md="4" className="mb-3">
    <fieldset>
      <FormCheckbox defaultChecked>8620 South Sepulveda Boulevard</FormCheckbox>
      <FormCheckbox defaultChecked>4675 Imperial Highway</FormCheckbox>
      <FormCheckbox>316 Rosecrans Avenue</FormCheckbox>
      <FormCheckbox>350 North Sepulveda Boulevard</FormCheckbox>
    </fieldset>
  </Col>
);

export default MatchCheckboxes;
