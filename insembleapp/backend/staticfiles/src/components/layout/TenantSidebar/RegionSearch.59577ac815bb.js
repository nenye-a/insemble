import React from "react";
import {
  Form,
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "shards-react";

export default () => (
  <Form className="main-sidebar__search w-100 border-right d-sm-flex" style={{ display: "flex", minHeight: "45px" }}>
    <InputGroup seamless className="ml-3">
      <InputGroupAddon type="prepend">
        <InputGroupText>
          <i className="material-icons">search</i>
        </InputGroupText>
        <FormInput
          className="navbar-search"
          placeholder="Search a region..."
          aria-label="Search"
        />
      </InputGroupAddon>
    </InputGroup>
  </Form>
);
