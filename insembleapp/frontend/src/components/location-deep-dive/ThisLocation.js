import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Col,
  FormSelect, 
  Container, 
  Badge
} from "shards-react";

import colors from "../../utils/colors";
import Chart from "../../utils/chart";

class RetailerSite extends React.Component {
  constructor(props) {
    super(props);

    this.location = this.props.match
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const location = this.props.match
    const chartConfig = {
      type: "doughnut",
      options: {
        ...{
          legend: false,
          cutoutPercentage: 80,
          tooltips: {
            enabled: false,
            mode: "index",
            position: "nearest"
          }
        },
      },
      data: {
        labels: Object.keys(location.census),
        datasets: [
          {
            hoverBorderColor: colors.white.toRGBA(1),
            data: Object.values(location.census), 
            backgroundColor: [
              colors.primary.toRGBA(1),
              colors.primary.toRGBA(0.8),
              colors.primary.toRGBA(0.6),
              colors.primary.toRGBA(0.4),
              colors.primary.toRGBA(0.2),
              colors.primary.toRGBA(0.1)
            ]
          }
        ]
      }
    };

    new Chart(this.canvasRef.current, chartConfig);
  }

  render() {
    console.log(this.props.match)
    const location = this.props.match
    const canvasRef = this.canvasRef
    const { title } = this.props;
    const labels = Object.keys(location.census)

    return (
      <Card small className="ubd-stats h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
          <div className="block-handle" />
        </CardHeader>

        <CardBody className="d-flex flex-column">
          <Container>
            <Row >
              <Col className="d-flex flex-column justify-content-center align-items-center py-2">{location.pop} residents within {location.radius} miles
              </Col>
              <Col className="d-flex flex-column justify-content-center align-items-center" style={{fontWeight: "bold"}}>Population
              </Col>
            </Row>
            <Row >
              <Col className="d-flex flex-column justify-content-center align-items-center">${location.income} per year
              </Col>
              <Col className="d-flex flex-column justify-content-center align-items-center" style={{fontWeight: "bold"}}>Median Household Income
              </Col>
            </Row>
            {/* <Row>
              <Col>Daytime Population
              </Col>
              <Col>68,879 as of 11/6
              </Col>
            </Row> */}
            <Row>
              <Col>
                <div className="user-details__tags py-4 justify-content-center align-items-center">
                  {Object.keys(location.nearby).map((category, idx) => (
                    <Badge
                      pill
                      theme="light"
                      className="text-light text-uppercase mb-2 border mr-1"
                      key={idx}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </Col>
              <Col className="d-flex flex-column justify-content-center align-items-center" style={{fontWeight: "bold"}}>Nearby Stores
              </Col>
            </Row>
            <Row>
              <Col className="d-flex flex-column justify-content-center align-items-center">
                {/* Chart */}
              <canvas
                width="100"
                ref={canvasRef}
                className="analytics-users-by-device mt-3 mb-4"
              />

              {/* Legend */}
              <div className="ubd-stats__legend w-75 m-auto pb-4">
                {labels.map((label, idx) => (
                  <div key={idx} className="ubd-stats__item px-1">
                    {label.icon && (
                      <div
                        dangerouslySetInnerHTML={{ __html: label.icon }}
                        style={{ color: label.iconColor }}
                      />
                    )}
                    <span className="ubd-stats__category">{label}</span>
                    <span className="ubd-stats__value">{location.census[label]}%</span>
                  </div>
                ))}
              </div>
              </Col>
              <Col className="d-flex flex-column justify-content-center align-items-center" style={{fontWeight: "bold"}}>Demographics
              </Col>
            </Row>
            


          </Container>
        </CardBody>

        <CardFooter className="border-top">
          <Row>
            {/* Time Span */}
            <Col>
              <FormSelect
                size="sm"
                value="half-mile"
                style={{ maxWidth: "130px" }}
                onChange={() => {}}
              >
                <option value="half-mile">0.5 Mile</option>
                <option value="2-miles">2 Miles</option>
                <option value="5-miles">5 Miles</option>
                <option value="10-miles">10 Miles</option>
                <option value="25-miles">25 Miles</option>
              </FormSelect>
            </Col>

            {/* View Full Report */}
            <Col className="text-right view-report">
              {/* eslint-disable-next-line */}
              <a href="#">View full report &rarr;</a>
            </Col>
          </Row>
        </CardFooter>
      </Card>
    );
  }

  getParsedLabels() {
    const { chartData } = this.props;

    if (!chartData || typeof chartData.labels === "undefined") {
      return [];
    }

    return chartData.labels.map((label, idx) => {
      const dataset = chartData.datasets[0];

      return {
        title: label,
        value: dataset.data[idx]
      };
    });
  }
}

RetailerSite.propTypes = {
  /**
   * The card's title.
   */
  title: PropTypes.string,
  /**
   * The Chart.js options.
   */
  chartOptions: PropTypes.object,
  /**
   * The chart data.
   */
  chartData: PropTypes.object,
  /**
   * The Chart.js config.
   */
  chartConfig: PropTypes.object
};

RetailerSite.defaultProps = {
  title: "This Location",
  chartConfig: Object.create(null),
  chartOptions: Object.create(null),
  chartData: {
    labels: ["Asian", "Black", "Hispanic", "Indian", "Multi", "White"],
    datasets: [
      {
        hoverBorderColor: colors.white.toRGBA(1),
        data: [3, 6, 15, 5, 14, 57],
        backgroundColor: [
          colors.primary.toRGBA(1),
          colors.primary.toRGBA(0.8),
          colors.primary.toRGBA(0.6),
          colors.primary.toRGBA(0.4),
          colors.primary.toRGBA(0.2),
          colors.primary.toRGBA(0.1)
        ]
      }
    ]
  }
};

export default RetailerSite;
