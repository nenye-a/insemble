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

class YourSite extends React.Component {
  constructor(props) {
    super(props);

    this.match = {_id: "5dbf15d713ea2c19bb1c5d73",
      name: "Everytable",
      lat: 34.0350855,
      lng: -118.2835359,
      address: "1101 West 23rd Street, Los Angeles",
      lat: 34.0350855,
      lng: -118.2835359,
      census: {
      asian: 25.4,
      black: 6.4,
      hispanic: 49.3,
      indian: 0.5,
      multi: 4.4,
      white: 17
      },
      pop: 8856,
      income: 25912,
      nearby: {
      "Comfort Food Restaurant": 1,
      "Pizza Place": 1,
      "Coworking Space": 1,
      "Bus Line": 1,
      "Coffee Shop": 2,
      "Wine Bar": 1,
      "Salon / Barbershop": 2,
      "Japanese Restaurant": 1,
      "Mexican Restaurant": 1,
      "Building": 1,
      "Gas Station": 1,
      "Burger Joint": 1,
      "Grocery Store": 1,
      "General Entertainment": 1,
      "High School": 1,
      "Theater": 1,
      "Taco Place": 1,
      "Cosmetics Shop": 1,
      "Doctor's Office": 1,
      "Italian Restaurant": 1,
      "School": 1,
      "Creperie": 1,
      "Church": 1,
      "Liquor Store": 1,
      "Historic Site": 1,
      "Laundry Service": 1,
      "Miscellaneous Shop": 1,
      },
      radius: 0.5,
      Retailer: {
        name: "Everytable",
        place_type: {
      "Vegetarian / Vegan Restaurant": 1,
      "Salad Place": 1},
      price: 1,
      likes: 15,
      ratings: 7.5,
      photo_count: 7,
      age: 3.36500878648779,
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png", 
      photo: "https://lh3.googleusercontent.com/p/AF1QipMRbf2dIA_Qu86-qJ7iEfVPMKXfFM-XQ9dtGUZz=s1600-w500-h500"
      },
    }
    

    this.canvasRef = React.createRef();
  }

  componentDidMount() {
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
        ...this.props.chartOptions
      },
      data: {
        labels: Object.keys(this.match.census),
        datasets: [
          {
            hoverBorderColor: colors.white.toRGBA(1),
            data: Object.values(this.match.census), 
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
    const location = this.match
    console.log(location)
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
              <Col className="d-flex flex-column justify-content-center align-items-center" style={{fontWeight: "bold"}}>Median Household Income
              </Col>
              <Col className="d-flex flex-column justify-content-center align-items-center">${location.income} per year
              </Col>
            </Row>
            {/* <Row>
              <Col>Daytime Population
              </Col>
              <Col>68,879 as of 11/6
              </Col>
            </Row> */}
            <Row>
              <Col className="d-flex flex-column justify-content-center align-items-center" style={{fontWeight: "bold"}}>Nearby Stores
              </Col>
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
            </Row>
            <Row>
              <Col className="d-flex flex-column justify-content-center align-items-center" style={{fontWeight: "bold"}}>Demographics
              </Col>
              <Col className="d-flex flex-column justify-content-center align-items-center">
                {/* Chart */}
              <canvas
                width="100"
                ref={this.canvasRef}
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

YourSite.propTypes = {
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

YourSite.defaultProps = {
  title: "Your Site",
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

export default YourSite;
