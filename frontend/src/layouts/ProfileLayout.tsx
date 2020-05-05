import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { View } from '../core-ui';
import ProfileCard from '../views/ProfilePage/ProfileCard';
import HeaderNavigationBar from '../components/layout/HeaderNavigationBar';
import { Role } from '../types/types';
import Footer from '../views/LandingPage/Footer';

type Props = {
  role: Role;
  children: ReactNode;
};

export default function ProfileLayout(props: Props) {
  return (
    <View>
      <HeaderNavigationBar />
      <Container>
        <ProfileCard role={props.role} />
        <Spacing />
        {props.children}
      </Container>
      <Footer />
    </View>
  );
}

const Container = styled(View)`
  flex-direction: row;
  padding: 24px 10vw;
  min-height: 80vh;
`;

const Spacing = styled(View)`
  width: 24px;
`;
