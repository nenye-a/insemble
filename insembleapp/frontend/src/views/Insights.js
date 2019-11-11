import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, ButtonGroup } from "shards-react";
import { NavLink } from "react-router-dom";
import MapContainer from "./MapContainer";


import PageTitle from "../components/common/PageTitle";
import RangeDatePicker from "../components/common/RangeDatePicker";
import SmallStats from "../components/common/SmallStats";
import TopReferrals from "../components/common/TopReferrals";
import CountryReports from "../components/common/CountryReports";
import Sessions from "../components/analytics/Sessions";
import UsersByDevice from "../components/analytics/UsersByDevice";
import GoalsOverview from "../components/analytics/GoalsOverview/GoalsOverview";

import colors from "../utils/colors";

const Insights = () => (
  <Container fluid className="main-content-container">
    <MapContainer className="mx-auto align-items-center"/>

  </Container>
  
  
);

export default Insights;
