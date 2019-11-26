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


import FormSectionTitle from "../components/edit-user-profile/FormSectionTitle";
import ProfileBackgroundPhoto from "../components/edit-user-profile/ProfileBackgroundPhoto";

class DescribeStore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [
        "User Experience",
        "UI Design",
        "React JS",
        "HTML & CSS",
        "JavaScript",
        "Bootstrap 4"
      ], 
      catData: []
    };

    this.searcher = null;

    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFilterSearch = this.handleFilterSearch.bind(this);

  }

  componentDidMount() {
    const catData = getCategoryData();

    this.setState({
      ...this.state,
      catData
    });

    // Initialize the fuzzy searcher.
    this.searcher = new FuzzySearch(
      catData,
      ["type"],
      { caseSensitive: false }
    );
  }

  handleTypeClick(type) {
    console.log("selected", type)
    this.setState(prevState =>
      { return {tags : prevState.tags.concat(type)} });
  }

  handleTagsChange(tags) {
    this.setState({ tags });
  }

  handleFormSubmit(e) {
    e.preventDefault();
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
                              onChange={() => {}}
                            />
                          </Col>

                        </Row>
                      </Col>
                    </Row>
                    
                    <Row className="mx-4">
                      <label>Category</label>
                    </Row>
                    <Row className="mx-4">
                      {/* Filters :: Search */}
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
                    </Row>

                    <Row className="mx-4">
                      <label>All Categories</label>
                    </Row>
                    <Row>
                      <div className="user-details__tags px-4">
                      {catData.map((entry, idx) => (
                        <Badge
                          pill
                          theme="light"
                          className="text-light text-uppercase mb-2 border mr-1"
                          onClick={()=>this.handleTypeClick(entry.type)}
                          key={idx}
                        >
                          {entry.type}
                        </Badge>
                      ))}
                      </div>
                    </Row>

                  </Form>
                </CardBody>
                <CardFooter className="border-top">
                  <Button
                    size="sm"
                    theme="accent"
                    className="ml-auto d-table mr-3"
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      
    );
  }
}

export default DescribeStore;
