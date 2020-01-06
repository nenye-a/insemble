import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import Title from './LandingPage/Title';
import Masthead from './LandingPage/Masthead';
import LocationsInput from './LandingPage/LocationsInput';
import TextInput from './LandingPage/TextInput';
import useGoogleMaps from '../utils/useGoogleMaps';
import { session } from '../utils/storage';
import { useSelector, useDispatch, useStore } from '../redux/helpers';
import { getLocation, loadMap } from '../redux/actions/space';
import urlSafeLatLng from '../utils/urlSafeLatLng';

function Landing() {
  let { isLoading } = useGoogleMaps();
  let history = useHistory();
  let dispatch = useDispatch();
  let { getState } = useStore();
  let isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  let locationLoaded = useSelector((state) => state.space.locationLoaded);
  // TODO: Handle error state
  // let locationErr = useSelector((state) => state.space.locationErr);
  let [submittingPlace, setSubmittingPlace] = useState<string | null>(null);
  useEffect(() => {
    if (locationLoaded === true) {
      let placeID = submittingPlace;
      // TODO: Using dispatch/getState like this is kinda messy.
      loadMap(true)(dispatch, getState);
      history.push(`/verify/${placeID}`);
    }
  }, [locationLoaded]);
  if (isAuthenticated) {
    return <Redirect to="/find" />;
  }
  return (
    <Masthead>
      <Title style={{ maxWidth: 580 }}>Find the next best location for your business</Title>
      {isLoading || submittingPlace ? (
        <TextInput placeholder="Loading..." disabled={true} />
      ) : (
        <LocationsInput
          placeholder="Enter the address of your top performing restaurant or store"
          buttonText="Find locations"
          onSubmit={(place) => {
            let placeID = place.place_id || '';
            let address = place.formatted_address || '';
            session.set(['place', placeID], place);
            session.set('sessionStoreName', place.name);
            session.set('sessionAddress', address);
            session.remove('sessionIncome');
            session.remove('sessionTags');
            let location = place.geometry ? place.geometry.location.toJSON() : null;
            if (location) {
              let { lat, lng } = urlSafeLatLng(location);
              // TODO: Using dispatch like this is kinda messy.
              getLocation(`/api/location/lat=${lat}&lng=${lng}&radius=1/`)(dispatch);
              setSubmittingPlace(placeID);
            }
          }}
        />
      )}
    </Masthead>
  );
}

export default Landing;
