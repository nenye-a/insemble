import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Title from './LandingPage/Title';
import Masthead from './LandingPage/Masthead';
import TextInput from './LandingPage/TextInput';

function Landing() {
  let isAuthenticated = useSelector((state) => state.isAuthenticated);
  if (isAuthenticated) {
    return <Redirect to="/Find" />;
  }
  return (
    <Masthead>
      <Title style={{ maxWidth: 580 }}>Find the next best location for your business</Title>
      <TextInput
        placeholder="Enter the address of your top performing restaurant or store"
        buttonText="Find locations"
        onSubmit={() => {}}
      />
    </Masthead>
  );
}

export default Landing;
