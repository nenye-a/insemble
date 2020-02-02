import React from 'react';
import { Card, CardHeader, CardBody, Col, Badge } from 'shards-react';

class About extends React.Component {
  render() {
    const retailer = this.props.match;
    let operations;
    if (Object.keys(retailer.locations).length >= 60) {
      operations = (
        <div>
          Operates {Object.keys(retailer.locations).length}+ locations in Los Angeles, California
        </div>
      );
    } else {
      operations = (
        <div>
          Operates {Object.keys(retailer.locations).length} locations in Los Angeles, California
        </div>
      );
    }

    return (
      <Card small className="h-100">
        {/* Card Header */}
        <CardHeader className="border-bottom">
          <h6 className="m-0">About</h6>
          <div className="block-handle" />
        </CardHeader>

        <CardBody className="pt-3">
          <Col>
            {/* Change static los angeles to vary by location */}

            {operations}
            <div className="user-details__tags p-4">
              {Object.keys(retailer.place_type).map((category, idx) => (
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
        </CardBody>
      </Card>
    );
  }
}

export default About;
