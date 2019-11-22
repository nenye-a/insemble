import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Col,
  FormSelect
} from "shards-react";

import colors from "../../utils/colors";
import Chart from "../../utils/chart";

class About extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const { title } = this.props;

    return (
      <Card small className="h-100">
        {/* Card Header */}
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
          <div className="block-handle" />
        </CardHeader>

        <CardBody className="pt-3">
          <Col>
            <div>Operates 6 locations in San Francisco, California</div>
            <div>Tags: Coffee, Local, Restaurant, Top performer</div>
          </Col>
        </CardBody>
      </Card>
    );
  }
}

About.propTypes = {
  /**
   * The card's title.
   */
  title: PropTypes.string,
};

About.defaultProps = {
  title: "About",
};

export default About;
