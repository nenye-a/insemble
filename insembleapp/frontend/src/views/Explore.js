/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
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

import Details from "../components/explore/Details";
import Demographics from "../components/explore/Demographics";
import PageTitle from "../components/common/PageTitle";
import { NavLink } from "react-router-dom";

class Explore extends React.Component {
  
  constructor(props) {
    
    super(props);

    this.state = {
      // First list of posts.
      LocationsList: [],
      PostsListOne: [
        {
          backgroundImage: require("../images/retailers/1.jpg"),
          category: "Insemble",
          categoryTheme: "royal-blue",
          author: "Anna Kunis",
          authorAvatar: require("../images/logos/ritual-logo.jpg"),
          title: "Ritual Coffee",
          date: "28 February 2019"
        },
        {
          backgroundImage: require("../images/retailers/2.jpg"),
          category: "Insemble",
          categoryTheme: "royal-blue",
          author: "James Jamerson",
          authorAvatar: require("../images/logos/coffeecultures-logo.jpg"),
          title: "Coffee Cultures",
          date: "29 February 2019"
        },
        {
          backgroundImage: require("../images/retailers/3.jpg"),
          category: "Insemble",
          categoryTheme: "royal-blue",
          author: "Peet's Coffee",
          authorAvatar: require("../images/logos/peets-logo.jpeg"),
          title: "Peet's Coffee",
          date: "29 February 2019"
        },
        {
          backgroundImage: require("../images/retailers/4.jpg"),
          category: "Insemble",
          categoryTheme: "royal-blue",
          author: "Patties Express",
          authorAvatar: require("../images/logos/patties-logo.png"),
          title: "Patties Express",
          date: "29 February 2019"
        },
        {
          backgroundImage: require("../images/retailers/5.jpg"),
          category: "Insemble",
          categoryTheme: "royal-blue",
          author: "Anna Kunis",
          authorAvatar: require("../images/logos/corepower-logo.jpg"),
          title: "Corepower Yoga",
          date: "28 February 2019"
        },
        {
          backgroundImage: require("../images/retailers/6.jpg"),
          category: "Regional",
          categoryTheme: "dark",
          author: "James Jamerson",
          authorAvatar: require("../images/logos/leos-logo.jpg"),
          title: "Leo's Tacos",
          date: "29 February 2019"
        }
        
      ],

      // Second list of posts.
      PostsListTwo: [
        {
          backgroundImage: require("../images/types/1.jpg"),
          category: "Travel",
          categoryTheme: "info",
          author: "Anna Ken",
          authorAvatar: require("../images/avatars/0.jpg"),
          title:
            "Coffee Shops",
          body:
            "Over the past few years, the independent, hole-in-the-wall coffee shop scene has exploded, meaning you have more options than ever in your search...",
          date: "29 February 2019"
        },
        {
          backgroundImage: require("../images/types/2.jpg"),
          category: "Business",
          categoryTheme: "dark",
          author: "John James",
          authorAvatar: require("../images/avatars/1.jpg"),
          title:
            "Healthy Experiences",
          body:
            "Consumers are placing more value on health and wellness than on material objects these days, and the definition of health and wellness has evolved...",
          date: "29 February 2019"
        }, 
        {
          backgroundImage: require("../images/types/3.jpg"),
          category: "Business",
          categoryTheme: "dark",
          author: "John James",
          authorAvatar: require("../images/avatars/1.jpg"),
          title:
            "Mediterranean",
          body:
            "There's no shortage of mediterranean desire in San Francisco, but with a convenient dining model that's supported by creative and flavorful...",
          date: "29 February 2019"
        }, 
        {
          backgroundImage: require("../images/types/4.jpeg"),
          category: "Business",
          categoryTheme: "dark",
          author: "John James",
          authorAvatar: require("../images/avatars/1.jpg"),
          title:
            "Mexican Restaurant",
          body:
            "Mexican-style food has entered the mainstream American diet, largely due to a growing Hispanic immigrant population that has increased demand...",
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
    
  componentDidMount() {
    fetch('/api/pair')
    .then(res => res.json())
    .then((data) => {
      this.setState({ LocationsList: data })
    })
    .catch(console.log)
  }

  render() {
    const {
      LocationsList,
      PostsListOne,
      PostsListTwo
    } = this.state;

    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Matches" subtitle="Explore Your top" className="text-sm-left" />
        </Row>

        {/* First Row of Posts */}
        <Row>
          {PostsListOne.map((post, idx) => (
            <Col lg="3" md="6" sm="12" className="mb-4" key={idx}>
              <Card tag={NavLink} to="/tenant-deep-dive" small className="card-post card-post--1">
                <div
                  className="card-post__image"
                  style={{ backgroundImage: `url(${post.backgroundImage})` }}
                >
                  <Badge
                    pill
                    className={`card-post__category bg-${post.categoryTheme}`}
                  >
                    {post.category}
                  </Badge>
                  <div className="card-post__author d-flex">
                    <a
                      href="#"
                      className="card-post__author-avatar card-post__author-avatar--small"
                      style={{ backgroundImage: `url('${post.authorAvatar}')` }}
                    >
                      Written by {post.author}
                    </a>
                  </div>
                </div>
                <CardBody>
                  <h5 className="card-title">
                    <a href="#" className="text-fiord-blue">
                      {post.title}
                    </a>
                  </h5>
                  <p className="card-text d-inline-block mb-3">{post.body}</p>
                  <span className="text-muted">{post.date}</span>
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
  

        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Your Location" subtitle="Area Statistics" className="text-sm-left" />
        </Row>

        {/* Second Row of Posts */}
        <Row>
          {/* Details */}
          <Col lg="8" md="12" sm="12" className="mb-4">
            <Details />
          </Col>

          {/* Users by Device */}
          <Col lg="4" md="6" sm="6" className="mb-4">
            <Demographics />
          </Col>
        </Row>

        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Your Top Categories" className="text-sm-left" />
        </Row>

        <Row>
          {PostsListTwo.map((post, idx) => (
            <Col lg="6" sm="12" className="mb-4" key={idx}>
              <Card small className="card-post card-post--aside card-post--1">
                <div
                  className="card-post__image"
                  style={{ backgroundImage: `url('${post.backgroundImage}')` }}
                >
                </div>
                <CardBody>
                  <h5 className="card-title">
                    <a className="text-fiord-blue" href="#">
                      {post.title}
                    </a>
                  </h5>
                  <p className="card-text d-inline-block mb-3">{post.body}</p>
                  <span className="text-muted">{post.date}</span>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Your Customer Journey" className="text-sm-left" />
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
                      <td>Home</td>
                      <td>45</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Work</td>
                      <td>25</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Sandwich Shop</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Park</td>
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
                        Going To
                      </th>
                      <th scope="col" className="border-0">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Home</td>
                      <td>45</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Work</td>
                      <td>25</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Sandwich Shop</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Park</td>
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

export default Explore;
