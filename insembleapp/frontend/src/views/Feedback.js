/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from 'react';
import { withRouter } from 'react-router';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLocation, loadMap } from '../redux/actions/space';

import { withAlert } from 'react-alert';

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Form,
  FormGroup,
  FormInput,
  FormCheckbox,
  Button,
} from 'shards-react';

import { NavLink } from 'react-router-dom';

class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

  static propTypes = {
    getLocation: PropTypes.func.isRequired,
  };

  uploadFeedback = (content, type) => {
    // Get current user from state
    const user = this.props.auth.user;

    // Headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    var time_stamp = new Date();

    var body = {
      content,
      type,
      time_stamp,
    };
    if (user) {
      body.user = user;
    }
    body = JSON.stringify(body);

    fetch('api/feedback/', {
      method: 'POST',
      headers: config.headers,
      body,
    })
      .then((res) => {
        if (res.ok) {
          console.log('Successful update');
          res.json().then((data) => console.log(data));
        } else {
          console.log('Failed to submit feedback.\n', res.status + ' ' + res.statusText);
          res.json().then((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err, 'failed to submit feedback'));
  };

  onSubmit = (e) => {
    e.preventDefault();

    var issueText = document.getElementById('formControlIssues').value;
    var feedbackText = document.getElementById('formControlFeedback').value;
    var featuresText = document.getElementById('formControlFeatures').value;

    this.uploadFeedback(issueText, 'issue');
    this.uploadFeedback(feedbackText, 'feedback');
    this.uploadFeedback(featuresText, 'features');

    this.setState({
      redirect: true,
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to={{ pathname: '/spaces' }} />;
    }

    return (
      <Container fluid className="main-content-container h-100 px-4">
        {/* {this.renderRedirect()} */}

        <Row noGutters className="h-100">
          <Col lg="7" md="11" className="auth-form mx-auto my-auto">
            <Card>
              <CardBody>
                {/* Logo */}
                <img
                  className="auth-form__logo d-table mx-auto mb-3"
                  style={{ maxHeight: '20px' }}
                  src={require('../images/insemble_i.png')}
                  alt="Insemble Logo"
                />

                {/* Title */}
                <h5 className="auth-form__title text-center mb-4">Feedback and Report Issues</h5>

                {/* Form Fields */}
                <Form>
                  <FormGroup>
                    <label htmlFor="formControlTextarea1">Report Issues</label>
                    <textarea
                      placeholder="Describe your issue"
                      className="form-control"
                      id="formControlIssues"
                      rows="3"
                    ></textarea>
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="exampleInputStoreName1">Additional Feedback</label>
                    <textarea
                      placeholder="Enter any additional feedback or questions"
                      className="form-control"
                      id="formControlFeedback"
                      rows="3"
                    ></textarea>
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="exampleInputStoreName1">Additional Features</label>
                    <textarea
                      placeholder="Any features you would like to see?"
                      className="form-control"
                      id="formControlFeatures"
                      rows="3"
                    ></textarea>
                  </FormGroup>
                  <Button
                    pill
                    theme="accent"
                    className="d-table mx-auto"
                    type="submit"
                    onClick={this.onSubmit}
                  >
                    Submit
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default withAlert()(withRouter(Feedback));
