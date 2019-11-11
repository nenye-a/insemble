import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, ButtonGroup } from "shards-react";
import { NavLink } from "react-router-dom";
import MapContainer from "./MapContainer";
import Iframe from 'react-iframe'

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
  <Iframe url=    "https://www.google.com/maps/d/u/0/embed?mid=1WvEuCnDtWqQ787eAhmIVfUQnTDVMNgx7"
        width="100%"
        height="750px"
        id="myId"
        className="mx-auto"
        display="initial"
        position="relative"/>
  
  
  
);

export default Insights;
