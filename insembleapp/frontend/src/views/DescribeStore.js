import React from "react";
import TagsInput from "react-tagsinput";
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
  InputGroupText
} from "shards-react";
import FuzzySearch from "fuzzy-search";
import getCategoryData from "../data/store-categories";

import { connect } from "react-redux";
import { loadMap } from '../redux/actions/space'

import FormSectionTitle from "../components/edit-user-profile/FormSectionTitle";
import ProfileBackgroundPhoto from "../components/edit-user-profile/ProfileBackgroundPhoto";

class DescribeStore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [], 
      catData: []
    };

    this.searcher = null;
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFilterSearch = this.handleFilterSearch.bind(this);
    this.incomeInput = React.createRef();

  }

  componentDidMount() {
    
    var catData = [];

    fetch('api/category/')
    .then(res => {
      if(res.ok) {
        console.log("searching for more data")
        res.json().then(data => {
          this.setState({
            ...this.state,
            catData: data
          })
        });
      } else {
        console.log("Failed to obtain categories");
      }
    })
    .catch(err => {
      console.log(err);
    })
    
    
    console.log("did it load?", catData)
    console.log("cd", this.state.catData.map(entry => {type=entry}))
  }

  handleTypeClick(type) {
    console.log("selected", type)
    this.setState(prevState =>
      { return {tags : prevState.tags.concat(type)} });
  }

  handleTagsChange(tags) {
    this.setState({ tags });
  }

  handleFormSubmit = e => {
    e.preventDefault();

    console.log(this.incomeInput.current.value)
    console.log(this.state.tags)

    this.props.loadMap(false, this.incomeInput.current.value, this.state.tags)
    
  }

  /**
   * Handles the global search.
   */
  handleFilterSearch(e) {
    this.setState({
      ...this.state,
      catData: this.searcher.search(e.target.value)
    });
  }

  render() {
    
    const catData = this.state.catData
    const catDataLimited = catData.slice(0,49)

    if(!(catData.length == 0) && !this.searcher) {
      this.searcher = new FuzzySearch(
        catData,
        { caseSensitive: false }
      );
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

                    <Row form className="mx-4">
                      <Col lg="8">
                        <Row form>
                          {/* First Name */}
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
                    
                    {/* Taken out for now since can't mount */}
                    <Row className="mx-4">
                      <label>Category</label>
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
                      {/* User Tags */}
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
                    </Row>

                    

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

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, { loadMap })(DescribeStore);
