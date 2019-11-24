import React from "react";
import { Container, Button } from "shards-react";
import { NavLink } from "react-router-dom";

const NoDeals = () => (
  <Container fluid className="main-content-container px-4 pb-4">
    <div className="error">
      <div className="error__content">
        <h2>0</h2>
        <h3>No Deals Yet!</h3>
        <p>You have no ongoing deals. Connect with matched retailers to get started.</p>
        <Button pill tag={NavLink} to="/matches">Find Tenants</Button>
      </div>
    </div>
  </Container>
);

export default NoDeals;
