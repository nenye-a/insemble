/* eslint-disable eqeqeq */
import React from 'react';
import TagsInput from 'react-tagsinput';
import {
  Alert,
  Container,
  Row,
  Col,
  Button,
  Badge,
  Card,
  CardBody,
  CardFooter,
  Nav,
  NavItem,
  NavLink,
  Form,
  FormInput,
  FormSelect,
  FormCheckbox,
  FormTextarea,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'shards-react';
import FuzzySearch from 'fuzzy-search';
import getCategoryData from '../data/store-categories';

import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { loadMap, clearLocation } from '../redux/actions/space';
import PropTypes from 'prop-types';

import FormSectionTitle from '../components/edit-user-profile/FormSectionTitle';
import ProfileBackgroundPhoto from '../components/edit-user-profile/ProfileBackgroundPhoto';

import { withAlert } from 'react-alert';

class DescribeStore extends React.Component {
  constructor(props) {
    super(props);

    // display tags from the session
    var tags = JSON.parse(sessionStorage.getItem('sessionTags'));
    if (!tags) tags = [];

    this.state = {
      tags,
      catData: [],
      redirect: false,
    };

    this.searcher = null;
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFilterSearch = this.handleFilterSearch.bind(this);
    this.incomeInput = React.createRef();
    this.alert = this.props.alert;
  }

  static propTypes = {
    hasLocation: PropTypes.bool,
  };
  componentDidMount() {
    // var catData = [];

    // if income in the session re-render
    if (sessionStorage.getItem('sessionIncome')) {
      this.incomeInput.current.value = parseInt(sessionStorage.getItem('sessionIncome'), 10);
    }

    fetch('api/category/')
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            this.setState({
              ...this.state,
              catData: data,
            });
          });
        } else {
          console.log('Failed to obtain categories');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleTypeClick(type) {
    console.log('selected', type);
    this.setState((prevState) => {
      return { tags: prevState.tags.concat(type) };
    });
  }

  handleTagsChange(tags) {
    this.setState({ tags });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    // clear session address or store name if available
    sessionStorage.removeItem('sessionAddress');
    sessionStorage.removeItem('sessionStoreName');

    const emptyIncome = this.incomeInput.current.value == '';
    const emptyCategories = this.state.tags.length == 0;

    // provide specific alerts if things are empty - otherwise provide insights
    if (emptyIncome) this.alert.show('Please provide target income');
    if (emptyCategories) this.alert.show('Please provide store categories.');
    if (!emptyIncome && !emptyCategories) {
      // store tags and income in session incase we need to re-render upon back button click
      sessionStorage.setItem('sessionTags', JSON.stringify(this.state.tags));
      sessionStorage.setItem('sessionIncome', this.incomeInput.current.value);

      // clear location if it exists - using short-circuit fashion
      this.props.hasLocation && this.props.clearLocation();

      // load map and redirect
      this.props.loadMap(false, this.incomeInput.current.value, this.state.tags);

      this.setState({
        redirect: true,
      });
    }
  };

  /**
   * Handles the global search.
   */
  handleFilterSearch(e) {
    this.setState({
      ...this.state,
      catData: this.searcher.search(e.target.value),
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={{ pathname: '/spaces' }} />;
    }

    const catData = this.state.catData;
    const catDataLimited = catData.slice(0, 49);

    if (!(catData.length == 0) && !this.searcher) {
      this.searcher = new FuzzySearch(catData, { caseSensitive: false });
    }

    return (
      <Container fluid className="main-content-container px-4">
        <Row>
          <Col lg="8" className="mx-auto mt-4">
            <Card small className="edit-user-details mb-4">
              <ProfileBackgroundPhoto />

              <CardBody className="p-0">
                {/* Form Section Title :: General */}
                <Form className="py-4" onSubmit={this.handleFormSubmit}>
                  <FormSectionTitle
                    title="Describe Store"
                    description="What are you looking for in a retail store?"
                  />

                  <Row className="px-4">
                    <Col md="4" className="form-group">
                      <label htmlFor="firstName">Target Income ($)</label>
                      <FormInput id="firstName" placeholder="100000" innerRef={this.incomeInput} />
                    </Col>
                    <Col md="4">
                      <Row>
                        <label>Category Search</label>
                      </Row>

                      <Row>
                        <Col className="d-flex">
                          <InputGroup seamless size="sm">
                            <InputGroupAddon type="prepend">
                              <InputGroupText>
                                <i className="material-icons">search</i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <FormInput onChange={this.handleFilterSearch} />
                          </InputGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col className="form-group">
                      <Row form className="mx-4">
                        <label htmlFor="userTags">Selected</label>
                      </Row>
                      <Row>
                        <TagsInput value={this.state.tags} onChange={this.handleTagsChange} />
                      </Row>
                    </Col>
                  </Row>
                  {/* 
                  <Row form className="mx-4">
                    <Col lg="8">
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="firstName">Target Income ($)</label>
                          <FormInput
                            id="firstName"
                            placeholder="100000"
                            innerRef={this.incomeInput}
                          />
                        </Col>

                      </Row>
                    </Col>
                  </Row>

                  <Row className="mx-4">
                    <label>Category Search</label>
                  </Row>

                  <Row className="mx-4">

                    <Col sm="4" className="d-flex">

                      <InputGroup seamless size="sm">
                        <InputGroupAddon type="prepend">
                          <InputGroupText>
                            <i className="material-icons">search</i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <FormInput onChange={this.handleFilterSearch} />
                      </InputGroup>


                    </Col>
                  </Row>

                  <Row form className="mx-4">
                    <label htmlFor="userTags">Selected</label>
                    <TagsInput
                      value={this.state.tags}
                      onChange={this.handleTagsChange}
                    />
                  </Row> */}
                  <Row className="mx-4">
                    <label>All Categories (click to load)</label>
                  </Row>
                  <Row>
                    <div className="user-details__tags mx-4">
                      {catDataLimited.map((entry, idx) => (
                        <Badge
                          pill
                          theme="light"
                          className="text-light text-uppercase mb-2 border mr-1"
                          onClick={() => this.handleTypeClick(entry)}
                          key={idx}
                        >
                          {entry}
                        </Badge>
                      ))}
                    </div>
                  </Row>

                  {/* User Tags
                      <Col md="6" className="form-group">
                        <label htmlFor="userTags">Selected</label>
                        <TagsInput
                          value={this.state.tags}
                          onChange={this.handleTagsChange}
                        />
                      </Col>
                      <Col>
                        <Row className="mx-4">
                        <label>All Categories (click to load)</label>
                        </Row>
                        <Row>
                          <div className="user-details__tags px-4">
                          {catDataLimited.map((entry, idx) => (
                            <Badge
                              pill
                              theme="light"
                              className="text-light text-uppercase mb-2 border mr-1"
                              onClick={()=>this.handleTypeClick(entry)}
                              key={idx}
                            >
                              {entry}
                            </Badge>
                          ))}
                          </div>
                        </Row>
                      </Col>
                    </Row> */}
                </Form>
              </CardBody>
              <CardFooter className="border-top">
                <Button
                  size="sm"
                  theme="accent"
                  className="ml-auto d-table mr-3"
                  onClick={this.handleFormSubmit}
                >
                  See Locations
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  hasLocation: state.space.hasLocation,
});

export default withAlert()(
  withRouter(
    connect(
      mapStateToProps,
      { loadMap, clearLocation }
    )(DescribeStore)
  )
);
