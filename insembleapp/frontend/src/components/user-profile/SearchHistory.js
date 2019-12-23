import React from 'react';
import { Card, CardHeader, CardBody, Col, Row, Badge } from 'shards-react';
import imgPlaceholder from '../../assets/images/image-placeholder.jpg';

// TODO: Uncomment this when it's migrated to ts
// TODO: Alternatively, use JSDoc within JS files (still needs tsconfig.json)
// type Props = {
//   data: Array<History>
// }

// type History = {
//   existing: boolean;
//   brandName?: string;
//   address?: string;
//   heatMapData?: any;
//   income: string;
//   categories: Array<string>
// }

export default function SearchHistory({ data }) {
  return (
    <>
      {data.map((item, index) => (
        <Card small className="p-0 mb-3 overflow-hidden" key={index}>
          <CardBody className="p-0">
            <div className="d-flex">
              {item.existing ? (
                <div className="d-flex flex-grow-1 flex-column justify-content-around p-3">
                  <Row className="m-0">
                    <Col md={4}>
                      <p className="m-0">
                        <b>Brand Name</b>
                      </p>
                    </Col>
                    <Col md={8}>
                      <p className="m-0">Spitz</p>
                    </Col>
                  </Row>
                  <Row className="m-0">
                    <Col md={4}>
                      <p className="m-0">
                        <b>Address</b>
                      </p>
                    </Col>
                    <Col md={8}>
                      <p className="m-0">312 St, LA</p>
                    </Col>
                  </Row>
                </div>
              ) : (
                <div className="d-flex flex-grow-1 flex-column justify-content-around p-3">
                  <Row className="m-0">
                    <Col md={4}>
                      <p className="m-0">
                        <b>Income</b>
                      </p>
                    </Col>
                    <Col md={8}>
                      <p className="m-0">$95,000</p>
                    </Col>
                  </Row>
                  <Row className="m-0">
                    <Col md={4}>
                      <p className="m-0">
                        <b>Categories</b>
                      </p>
                    </Col>
                    <Col md={8}>
                      {item.categories.map((category, index) => (
                        <Badge theme="primary" className="text-uppercase mb-2 mr-1" key={index}>
                          {category}
                        </Badge>
                      ))}
                    </Col>
                  </Row>
                </div>
              )}

              {/* TODO: change to maps */}
              <img alt="map" src={imgPlaceholder} height="130" />
            </div>
          </CardBody>
        </Card>
      ))}
    </>
  );
}
