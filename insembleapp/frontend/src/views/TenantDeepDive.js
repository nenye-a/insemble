/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Button
} from "shards-react";

import Sessions from "../components/explore/Sessions";
import AtAGlance from "../components/tenant-deep-dive/AtAGlance";
import SiteComparison from "../components/tenant-deep-dive/SiteComparison";
import Buildout from "../components/tenant-deep-dive/Buildout";
import About from "../components/tenant-deep-dive/About";
import UsersByDevice from "../components/explore/UsersByDevice";
import PageTitle from "../components/common/PageTitle";
import MapContainer from "./MapContainer";
import Iframe from 'react-iframe'

class TenantDeepDive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // First list of posts.
      PostsListOne: [
        {
          backgroundImage: require("../images/content-management/1.jpeg"),
          category: "Business",
          categoryTheme: "dark",
          author: "Anna Kunis",
          authorAvatar: require("../images/avatars/1.jpg"),
          title: "Ritual Coffee",
          date: "28 February 2019"
        },
        {
          backgroundImage: require("../images/content-management/2.jpeg"),
          category: "Travel",
          categoryTheme: "info",
          author: "James Jamerson",
          authorAvatar: require("../images/avatars/2.jpg"),
          title: "Coffee Cultures",
          date: "29 February 2019"
        },
        {
          backgroundImage: require("../images/content-management/3.jpeg"),
          category: "Technology",
          categoryTheme: "royal-blue",
          author: "Peet's Coffee",
          authorAvatar: require("../images/avatars/2.jpg"),
          title: "Peet's Coffee",
          date: "29 February 2019"
        },
        {
          backgroundImage: require("../images/content-management/4.jpeg"),
          category: "Business",
          categoryTheme: "warning",
          author: "Patties Express",
          authorAvatar: require("../images/avatars/3.jpg"),
          title: "Patties Express",
          date: "29 February 2019"
        },
        {
          backgroundImage: require("../images/content-management/1.jpeg"),
          category: "Business",
          categoryTheme: "dark",
          author: "Anna Kunis",
          authorAvatar: require("../images/avatars/1.jpg"),
          title: "Corepower Yoga",
          date: "28 February 2019"
        },
        {
          backgroundImage: require("../images/content-management/2.jpeg"),
          category: "Travel",
          categoryTheme: "info",
          author: "James Jamerson",
          authorAvatar: require("../images/avatars/2.jpg"),
          title: "Leo's Tacos",
          date: "29 February 2019"
        }
        
      ],

      // Second list of posts.
      PostsListTwo: [
        {
          backgroundImage: require("../images/content-management/5.jpeg"),
          category: "Travel",
          categoryTheme: "info",
          author: "Anna Ken",
          authorAvatar: require("../images/avatars/0.jpg"),
          title:
            "Coffee Shops",
          body:
            "Conviction up partiality as delightful is discovered. Yet jennings resolved disposed exertion you off. Left did fond drew fat head poor jet pan flying over...",
          date: "29 February 2019"
        },
        {
          backgroundImage: require("../images/content-management/6.jpeg"),
          category: "Business",
          categoryTheme: "dark",
          author: "John James",
          authorAvatar: require("../images/avatars/1.jpg"),
          title:
            "Healthy Experiences",
          body:
            "Discovered had get considered projection who favourable. Necessary up knowledge it tolerably. Unwilling departure education to admitted speaking...",
          date: "29 February 2019"
        }, 
        {
          backgroundImage: require("../images/content-management/6.jpeg"),
          category: "Business",
          categoryTheme: "dark",
          author: "John James",
          authorAvatar: require("../images/avatars/1.jpg"),
          title:
            "Mediterranean",
          body:
            "Discovered had get considered projection who favourable. Necessary up knowledge it tolerably. Unwilling departure education to admitted speaking...",
          date: "29 February 2019"
        }, 
        {
          backgroundImage: require("../images/content-management/6.jpeg"),
          category: "Business",
          categoryTheme: "dark",
          author: "John James",
          authorAvatar: require("../images/avatars/1.jpg"),
          title:
            "Mexican Restaurant",
          body:
            "Discovered had get considered projection who favourable. Necessary up knowledge it tolerably. Unwilling departure education to admitted speaking...",
          date: "29 February 2019"
        }
      ],

      // Third list of posts.
      PostsListThree: [
        {
          author: "John James",
          authorAvatar: require("../images/avatars/1.jpg"),
          title: "Had denoting properly jointure which well books beyond",
          body:
            "In said to of poor full be post face snug. Introduced imprudence see say unpleasing devonshire acceptance son. Exeter longer wisdom work...",
          date: "29 February 2019"
        },
        {
          author: "John James",
          authorAvatar: require("../images/avatars/2.jpg"),
          title: "Husbands ask repeated resolved but laughter debating",
          body:
            "It abode words began enjoy years no do ﻿no. Tried spoil as heart visit blush or. Boy possible blessing sensible set but margaret interest. Off tears...",
          date: "29 February 2019"
        },
        {
          author: "John James",
          authorAvatar: require("../images/avatars/3.jpg"),
          title:
            "Instantly gentleman contained belonging exquisite now direction",
          body:
            "West room at sent if year. Numerous indulged distance old law you. Total state as merit court green decay he. Steepest merit checking railway...",
          date: "29 February 2019"
        }
      ],

      // Fourth list of posts.
      PostsListFour: [
        {
          backgroundImage: require("../images/content-management/7.jpeg"),
          author: "Alene Trenton",
          authorUrl: "#",
          category: "News",
          categoryUrl: "#",
          title: "Extremity so attending objection as engrossed",
          body:
            "Pursuit chamber as elderly amongst on. Distant however warrant farther to of. My justice wishing prudent waiting in be...",
          date: "29 February 2019"
        },
        {
          backgroundImage: require("../images/content-management/8.jpeg"),
          author: "Chris Jamie",
          authorUrl: "#",
          category: "News",
          categoryUrl: "#",
          title: "Bed sincerity yet therefore forfeited his",
          body:
            "Speaking throwing breeding betrayed children my to. Me marianne no he horrible produced ye. Sufficient unpleasing and...",
          date: "29 February 2019"
        },
        {
          backgroundImage: require("../images/content-management/9.jpeg"),
          author: "Monica Jordan",
          authorUrl: "#",
          category: "News",
          categoryUrl: "#",
          title: "Object remark lively all did feebly excuse our",
          body:
            "Morning prudent removal an letters by. On could my in order never it. Or excited certain sixteen it to parties colonel not seeing...",
          date: "29 February 2019"
        },
        {
          backgroundImage: require("../images/content-management/10.jpeg"),
          author: "Monica Jordan",
          authorUrl: "#",
          category: "News",
          categoryUrl: "#",
          title: "His followed carriage proposal entrance",
          body:
            "For county now sister engage had season better had waited. Occasional mrs interested far expression directly as regard...",
          date: "29 February 2019"
        }
      ]
    };
  }

  render() {
    const {
      PostsListOne,
      PostsListTwo
    } = this.state;

    return (
      <Container fluid className="main-content-container px-4">
        <Iframe url="https://www.google.com/maps/embed/v1/search?key=AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U&q=Ritual+Coffee+San+Francisco"
        width="100%"
        height="300px"
        id="myId"
        className="mx-auto"
        display="initial"
        position="relative"/>

        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <div className="user-details__avatar" position="absolute" top="30">
            <img src={require("../images/avatars/0.jpg")} alt={"Coffe Shop"} />
          </div>
          <PageTitle title="Ritual Coffee" subtitle="Coffee, Local" className="ml-4 mt-3" />
        </Row>

        {/* Second Row of Posts */}
        <Row>
          {/* At A Glance */}
          <Col lg="7" md="12" sm="12" className="mb-4">
            <AtAGlance />
          </Col>

          {/* About */}
          <Col lg="5" md="6" sm="6" className="mb-4">
            <About />
          </Col>
        </Row>

        <Row noGutters className="page-header py-2">
          <PageTitle sm="4" title="Site Comparison" className="text-sm-left" />
        </Row>

        {/* Site Comparison */}
        <Row>
          {/* Site Comparison */}
          <Col lg="6" md="6" sm="6" className="mb-4">
            <SiteComparison />
          </Col>

          {/* Site Comparison */}
          <Col lg="6" md="6" sm="6" className="mb-4">
            <SiteComparison />
          </Col>
        </Row>

        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Buildout" className="text-sm-left" />
        </Row>

        {/* Buildout */}
        <Row>
          {/* Site Comparison */}
          <Col className="mb-4">
            <Buildout />
          </Col>
        </Row>

        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Customer Journey" className="text-sm-left" />
        </Row>

        {/* Fourth Row of posts */}
        {/* Default Light Table */}
        <Row>
          <Col>
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">Before</h6>
              </CardHeader>
              <CardBody className="p-0 pb-3">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                        Rank
                      </th>
                      <th scope="col" className="border-0">
                        Coming From
                      </th>
                      <th scope="col" className="border-0">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Russian Federation</td>
                      <td>45</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Estonia</td>
                      <td>25</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Cyprus</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Liberia</td>
                      <td>10</td>
                    </tr>
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card small className="mb-4 overflow-hidden">
              <CardHeader className="bg-dark">
                <h6 className="m-0 text-white">After</h6>
              </CardHeader>
              <CardBody className="bg-dark p-0 pb-3">
                <table className="table table-dark mb-0">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col" className="border-0">
                        Rank
                      </th>
                      <th scope="col" className="border-0">
                        Coming From
                      </th>
                      <th scope="col" className="border-0">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Russian Federation</td>
                      <td>45</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Estonia</td>
                      <td>25</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Cyprus</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Liberia</td>
                      <td>10</td>
                    </tr>
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        
        </Row>

      </Container>
    );
  }
}

export default TenantDeepDive;
