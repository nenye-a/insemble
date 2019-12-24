import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import Title from './LandingPage/Title';
import Masthead from './LandingPage/Masthead';
import LocationsInput from './LandingPage/LocationsInput';
import TextInput from './LandingPage/TextInput';
import useGoogleMaps from '../utils/useGoogleMaps';
import { session } from '../utils/storage';
import useSelector from '../redux/useSelector';

function Landing() {
  let { isLoading } = useGoogleMaps();
  let history = useHistory();
  let isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (isAuthenticated) {
    return <Redirect to="/find" />;
  }
  return (
    <Masthead>
      <Title style={{ maxWidth: 580 }}>Find the next best location for your business</Title>
      {isLoading ? (
        <TextInput placeholder="Loading..." disabled={true} />
      ) : (
        <LocationsInput
          placeholder="Enter the address of your top performing restaurant or store"
          buttonText="Find locations"
          onSubmit={(place) => {
            let placeID = place.place_id || '';
            session.set(['place', placeID], place);
            history.push(`/verify/${placeID}`);
          }}
        />
      )}
    </Masthead>
  );
}

export default Landing;
