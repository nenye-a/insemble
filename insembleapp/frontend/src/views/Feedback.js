/* eslint-disable @typescript-eslint/camelcase, no-console */

import React from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withAlert } from 'react-alert';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Button } from 'shards-react';

import { getLocation } from '../redux/actions/space';

class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
    this.alert = this.props.alert;
  }

  static propTypes = {
    getLocation: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
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

    console.log('submit registered');

    let time_stamp = new Date();

    let body = {
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

    let issueText = document.getElementById('formControlIssues').value;
    let feedbackText = document.getElementById('formControlFeedback').value;
    let featuresText = document.getElementById('formControlFeatures').value;

    if (issueText === '' && feedbackText === '' && featuresText === '') {
      this.alert.show('Please provide feedback before submitting!');
    } else {
      this.uploadFeedback(issueText, 'issue');
      this.uploadFeedback(feedbackText, 'feedback');
      this.uploadFeedback(featuresText, 'features');

      this.setState({
        redirect: true,
      });
    }
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
                  src="https://d3v63q50apccnu.cloudfront.net/insemble_i.png"
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
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="exampleInputStoreName1">Additional Feedback</label>
                    <textarea
                      placeholder="Enter any additional feedback or questions"
                      className="form-control"
                      id="formControlFeedback"
                      rows="3"
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="exampleInputStoreName1">Additional Features</label>
                    <textarea
                      placeholder="Any features you would like to see?"
                      className="form-control"
                      id="formControlFeatures"
                      rows="3"
                    />
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

export default withAlert()(
  withRouter(
    connect(
      mapStateToProps,
      { getLocation }
    )(Feedback)
  )
);
