import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, ButtonGroup } from "shards-react";
import { NavLink } from "react-router-dom";
import MapContainer from "./MapContainer";
import Iframe from 'react-iframe';

import PageTitle from "../components/common/PageTitle";
import RangeDatePicker from "../components/common/RangeDatePicker";
import SmallStats from "../components/common/SmallStats";
import TopReferrals from "../components/common/TopReferrals";
import CountryReports from "../components/common/CountryReports";
import GoalsOverview from "..DELETED_BASE64_STRING";

import colors from "../utils/colors";

const Insights = () => (
  <Container fluid className="main-content-container m-0">
    <Row>
      <MapContainer/>
    </Row>
  </Container>
  
  
  
);

export default Insights;
