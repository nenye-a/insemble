import React, { useState } from 'react';
import { Container, Row, Col } from 'shards-react';
import UserDetails from '../components/user-profile/UserDetails';
import UserAccountDetails from '../components/user-profile/UserAccountDetails';
import SearchHistory from '../components/user-profile/SearchHistory';

// type Segment = 'userAccountDetails' | 'searchHistory'

export default function UserProfile() {
  let [selectedSegment, setSelectedSegment] = useState('searchHistory'); // TODO: change to conts
  return (
    <Container fluid className="main-content-container px-4">
      <Row className="py-4">
        <Col lg={{ offset: 1, size: 10 }}>
          <Row>
            <Col lg="4">
              <UserDetails
                name="Nenye Anagbogu"
                companyName="Spitz"
                onSegmentClick={setSelectedSegment}
                selectedSegment={selectedSegment}
              />
            </Col>
            <Col lg="8">
              {selectedSegment === 'userAccountDetails' ? (
                <UserAccountDetails />
              ) : (
                <SearchHistory
                  data={[
                    {
                      existing: true,
                      brandName: 'Starbucks',
                      address: '213 St, LA',
                      income: null,
                      categories: [],
                    },
                    {
                      existing: false,
                      categories: ['Mexican Food', 'Pizza', 'Coffee', 'Pasta', 'Steak', 'Fashion'],
                    },
                  ]}
                />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
