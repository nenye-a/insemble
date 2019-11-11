import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  ButtonGroup,
  Button, 
  Badge
} from "shards-react";

import RangeDatePicker from "../common/RangeDatePicker";

import colors from "../../utils/colors";
import Chart from "../../utils/chart";

class Sessions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title } = this.props;
    const { userData} = this.props;

    return (
      <Card small className="h-100">
        {/* Card Header */}
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
          <div className="block-handle" />
        </CardHeader>

        <CardBody className="pt-0">
          <div className="user-details__user-data border-bottom p-4">
            <Row className="mb-3">
              <Col className="w-50">
                <span>Average Price</span>
                <span>{"DELETED_EMAIL"}</span>
              </Col>
            </Row>
            <Row>
              <Col className="w-50">
                <span>Average Income</span>
                <span>{"remote"}</span>
              </Col>
            </Row>
            <Row>
              <Col className="w-50">
                <span>Walkability Score</span>
                <span>{"remote"}</span>
              </Col>
            </Row>
            <Row>
              <Col className="w-50">
                <span>Top Influences</span>
                <span>{"remote"}</span>
              </Col>
            </Row>
          </div>
          <span>Top Influences</span>
          <div className="user-details__tags p-4">
            {userData.tags.map((tag, idx) => (
              <Badge
                pill
                theme="light"
                className="text-light text-uppercase mb-2 border mr-1"
                key={idx}
              >
                {tag}
              </Badge>
            ))}
          </div>
          
        </CardBody>
      </Card>
    );
  }
}

Sessions.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The Chart.js data.
   */
  chartData: PropTypes.object,
  /**
   * The Chart.js config options.
   */
  chartOptions: PropTypes.object
};

Sessions.defaultProps = {
  title: "Sessions",
  chartData: {
    labels: [
      "09:00 PM",
      "10:00 PM",
      "11:00 PM",
      "12:00 PM",
      "13:00 PM",
      "14:00 PM",
      "15:00 PM",
      "16:00 PM",
      "17:00 PM"
    ],
    datasets: [
      {
        label: "Today",
        fill: "start",
        data: [5, 5, 10, 30, 10, 42, 5, 15, 5],
        backgroundColor: colors.primary.toRGBA(0.1),
        borderColor: colors.primary.toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: colors.primary.toRGBA(1),
        borderWidth: 1.5
      },
      {
        label: "Yesterday",
        fill: "start",
        data: ["", 23, 5, 10, 5, 5, 30, 2, 10],
        backgroundColor: colors.salmon.toRGBA(0.1),
        borderColor: colors.salmon.toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: colors.salmon.toRGBA(1),
        borderDash: [5, 5],
        borderWidth: 1.5,
        pointRadius: 0,
        pointBorderColor: colors.salmon.toRGBA(1)
      }
    ]
  },
  userData: {
    coverImg: require("../../images/user-profile/up-user-details-background.jpg"),
    avatarImg: require("../../images/avatars/0.jpg"),
    name: "Sierra Brooks",
    bio: "I'm a design focused engineer.",
    email: "DELETED_EMAIL",
    location: "Remote",
    phone: "+40 1234 567 890",
    accNumber: "123456789",
    social: {
      facebook: "#",
      twitter: "#",
      github: "#",
      slack: "#"
    },
    tags: [
      "Cocktail Bars",
      "Coffee Shops",
      "Ice Cream",
      "Bookstores"
    ]
  }
};

export default Sessions;
