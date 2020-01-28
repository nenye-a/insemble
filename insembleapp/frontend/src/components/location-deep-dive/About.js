import React from 'react';
import { Card, CardHeader, CardBody, Col } from 'shards-react';

class About extends React.Component {
  render() {
    // const retailer = this.props.match;
    // let operations;
    // if (Object.keys(retailer.locations).length >= 60){
    //   operations = <div>Operates {Object.keys(retailer.locations).length}+ locations in Los Angeles, California</div>
    // } else {
    //   operations = <div>Operates {Object.keys(retailer.locations).length} locations in Los Angeles, California</div>
    // }

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
            Property Type Year built & Class
          </Col>
        </CardBody>
      </Card>
    );
  }
}

export default About;
