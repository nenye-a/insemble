/* eslint-disable no-console */
import React from 'react';
import { Container, Row, Col, Card, CardBody, CardFooter, Badge, Button } from 'shards-react';

import PageTitle from '../components/common/PageTitle';
import { NavLink } from 'react-router-dom';

class Explore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      LocationsList: [],
      // First list of posts.
    };
  }

  componentDidMount() {
    fetch('/api/pair')
      .then((res) => res.json())
      .then((data) => {
        this.setState({ LocationsList: data });
      })
      .catch(console.log);
  }

  render() {
    const { LocationsList } = this.state;

    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Matches" subtitle="Your top" className="text-sm-left" />
        </Row>
        {/* First Row of Posts */}
        <Row>
          {LocationsList.map((retailer, idx) => (
            <Col lg="3" md="6" sm="12" className="mb-4" key={idx}>
              <Card
                tag={NavLink}
                to={{ pathname: '/tenant-deep-dive', match: retailer }}
                small
                className="card-post card-post--1"
              >
                <div
                  className="card-post__image"
                  style={{ backgroundImage: `url(${retailer.photo})` }} //replace this
                >
                  <Badge
                    pill
                    className={`card-post__category bg-${'royal-blue'}`} // warn
                  >
                    {'Insemble'}
                  </Badge>
                  <div className="card-post__author d-flex">
                    <a
                      href="#"
                      className="card-post__author-avatar card-post__author-avatar--small"
                      style={{ backgroundImage: `url('${retailer.icon}')` }}
                    />
                  </div>
                </div>
                <CardBody>
                  <h5 className="card-title">
                    <a href="#" className="text-fiord-blue">
                      {retailer.name}
                    </a>
                  </h5>

                  <p className="card-text d-inline-block mb-3">{retailer.census.asian}</p>
                  <span className="text-muted">{retailer.income}</span>
                </CardBody>
                <CardFooter className="border-top d-flex">
                  <div className="my-auto ml-auto">
                    <Button size="sm" theme="white">
                      <i className="far fa-bookmark mx-1" /> Connect
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}

export default Explore;
