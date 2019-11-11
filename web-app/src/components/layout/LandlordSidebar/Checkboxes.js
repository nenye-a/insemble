import React from "react";
import { Col, FormCheckbox } from "shards-react";

const Checkboxes = () => (
  <Col sm="12" md="4" className="mb-3">
    <fieldset>
      <FormCheckbox defaultChecked>Fast Food</FormCheckbox>
      <FormCheckbox defaultChecked>Mexican Restaurant</FormCheckbox>
      <FormCheckbox>Pizza Place</FormCheckbox>
      <FormCheckbox>Sandwich Place</FormCheckbox>
    </fieldset>
  </Col>
);

export default Checkboxes;
