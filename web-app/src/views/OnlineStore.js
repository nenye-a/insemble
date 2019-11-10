import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, ButtonGroup, Button } from "shards-react";
import { NavLink } from "react-router-dom";
import MapContainer from "./MapContainer";


import PageTitle from "../components/common/PageTitle";
import RangeDatePicker from "../components/common/RangeDatePicker";
import SmallStats from "../components/common/SmallStats";
import CountryReports from "../components/common/CountryReports";
import SalesReport from "../components/ecommerce/SalesReport";
import SalesByCategory from "../components/ecommerce/SalesByCategory";
import LatestOrders from "../components/ecommerce/LatestOrders";

import colors from "../utils/colors";

const OnlineStore = ({ smallStats }) => (
  <Container fluid className="main-content-container px-4">
    <MapContainer />

  </Container>
);

export default OnlineStore;
