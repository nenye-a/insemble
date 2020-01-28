import React from 'react';
import { Card, CardHeader, ListGroup, ListGroupItem, Row, Col, Form, Button } from 'shards-react';
import { TextInputWithLabel as TextInput } from '../../core-ui/index';

export default function UserAccountDetails({ title }) {
  return (
    <Card small className="mb-4">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{title}</h6>
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form>
                <Row form>
                  <Col md="6" className="form-group">
                    <TextInput
                      id="uadFirstName"
                      label="First Name"
                      placeholder="First Name"
                      value="Sierra"
                    />
                  </Col>
                  <Col md="6" className="form-group">
                    <TextInput
                      id="uadLastName"
                      label="Last Name"
                      placeholder="Last Name"
                      value="Sierra"
                    />
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <TextInput
                      id="uadEmail"
                      label="Email"
                      placeholder="Email"
                      value="sierra.brooks@gmail.com"
                    />
                  </Col>
                  <Col md="6" className="form-group">
                    <TextInput
                      id="uadCompany"
                      label="Company"
                      placeholder="Company"
                      value="Insemble"
                    />
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <p>Change your password</p>
                  </Col>
                </Row>
                <Row form>
                  <Col md="4" className="form-group">
                    <TextInput
                      id="uadCurrentPassword"
                      label="Current Password"
                      placeholder="Current Password"
                      value="thisiscurrentpassword"
                      type="password"
                    />
                  </Col>
                  <Col md="4" className="form-group">
                    <TextInput
                      id="uadNewPassword"
                      label="New Password"
                      placeholder="New Password"
                      value="thisisnewpassword"
                      type="password"
                    />
                  </Col>
                  <Col md="4" className="form-group">
                    <TextInput
                      id="uadConfirmNewPassword"
                      label="Confirm New Password"
                      placeholder="COnfirm New Password"
                      value="thisisnewpassword"
                      type="password"
                    />
                  </Col>
                </Row>

                <Button className="float-right" theme="accent">
                  Update Account
                </Button>
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
}

UserAccountDetails.defaultProps = {
  title: 'Account Details',
};
